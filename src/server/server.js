import express from 'express';
import mysql from 'mysql';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';

const salt = 10;
const app = express();
app.use(cors({
    origin: ['http://localhost:5173'],  // Allow requests only from this frontend
    methods: ['POST', 'GET'],           // Allow only POST and GET requests
    credentials: true                   // Allow sending cookies (important for JWT authentication)
}));

app.use(cookieParser());
app.use(express.json()); // takes json, gives back js

const SECRET_ACCESS_KEY = "penis1";  // Store in environment variable in production
const SECRET_REFRESH_KEY = "penis2";  // Store in environment variable in production

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "oven2005",
    database: "signup"
});

// Middleware function to verify user from access token
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;  // Check for the access token in the cookies
    if (!token) {
        return res.status(401).json({ Error: "You are not authenticated" });
    }
    jwt.verify(token, SECRET_ACCESS_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ Error: "Token is not valid" });
        }
        req.name = decoded.name;
        req.userId = decoded.userId
        next();
    });
};

// Refresh Token logic
const refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken; // Check for the refresh token
    if (!refreshToken) {
        return res.status(401).json({ Error: "No refresh token found" });
    }

    jwt.verify(refreshToken, SECRET_REFRESH_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ Error: "Refresh token is not valid" });
        }

        // Create a new access token
        const newAccessToken = jwt.sign({ name: decoded.name }, SECRET_ACCESS_KEY, { expiresIn: '15m' });

        // Send the new access token in the response
        res.cookie('token', newAccessToken, {
            httpOnly: true,
            secure: false, //for localhost
            sameSite: 'Strict',
            maxAge: 15 * 60 * 1000  // 15 minutes
        });

        return res.json({ Status: "Access token refreshed" });
    });
};

app.get('/', verifyUser, (req, res) => {
    return res.json({ Status: "Success", name: req.name });
});
app.get('/notes',verifyUser,(req,res)=>{
    
    const selectNotesSql = "SELECT * from notes where user_id = ?";
    db.query(selectNotesSql,[req.userId],(err,data)=>{
        if(err){
            return res.json({Error:"Database error"});
        }
        if(data.length===0){
            return res.json({Error:"No notes"})
        }
        return res.json({Status: "Success",notes:data})
    })

})
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    return res.json({ Status: "Logged out" });
});

app.post('/register', (req, res) => {
    const checkEmailSql = "SELECT email FROM login WHERE email = ?";

    db.query(checkEmailSql, [req.body.email], (err, data) => {
        if (err) {
            return res.json({ Error: "Database error" });
        }
        if (data.length > 0) {
            return res.json({ Error: "Account with this email already exists" });
        }
        const sql = "INSERT INTO login (`name`, `email`, `password`) VALUES (?)";

        bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
            if (err) {
                console.log("Hashing Error: ", err);
                return res.json({ Error: "Error hashing password", details: err });
            }

            const values = [req.body.name, req.body.email, hash];

            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log("SQL Error: ", err);
                    return res.json({ Error: "Inserting data error", details: err });
                }
                return res.json({ Status: "Success" });
            });
        });
    });
});

app.post('/login', (req, res) => {
    const sql = 'SELECT * FROM login WHERE email = ?';

    db.query(sql, [req.body.email], (err, data) => {
        if (err) return res.json({ Error: 'Login error in server' });

        if (data.length > 0) {
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if (err) return res.json({ Error: "Password compare error" });

                if (response) {
                    const name = data[0].name;
                    const userId = data[0].id
                    const accessToken = jwt.sign({userId,name }, SECRET_ACCESS_KEY, { expiresIn: '3m' });
                    const refreshToken = jwt.sign({userId,name }, SECRET_REFRESH_KEY, { expiresIn: '7d' });

                    // Set HttpOnly cookies for both access token and refresh token
                    res.cookie('token', accessToken, {
                        httpOnly: true,
                        secure: false, // only for localhost since http not https
                        sameSite: 'Strict',
                        maxAge: 3 * 60 * 1000  // 3 minutes - in milliseconds
                    });

                    res.cookie('refreshToken', refreshToken, {
                        httpOnly: true,
                        secure: false, // only for localhost since http not https
                        sameSite: 'Strict',
                        maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
                    });

                    return res.json({ Status: "Success" });
                } else {
                    return res.json({ Error: "Password not matched" });
                }
            });
        } else {
            return res.json({ Error: "No Account with this Email" });
        }
    });
});

// Route to refresh the access token
app.get('/refresh-token', refreshToken);

app.listen(5001, () => {
    console.log('Listening on port 5001');
});
