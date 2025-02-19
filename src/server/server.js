import express from 'express';
import mysql from 'mysql';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
dotenv.config();


const salt = 10;
const app = express();
app.use(cors({
    origin: ['http://localhost:5173'],  // Allow requests only from this frontend
    methods: ['POST', 'GET','PUT','PATCH'],           // Allow only POST and GET requests
    credentials: true                   // Allow sending cookies (important for JWT authentication)
}));

app.use(cookieParser());
app.use(express.json()); // takes json, gives back js


const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY || "blboasdfo2";  // Store in environment variable in production
const SECRET_REFRESH_KEY = process.env.SECRET_REFRESH_KEY || "blabal2";  // Store in environment variable in production
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
        console.log("Decoded Token:", decoded); // Log decoded token to verify contents

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
        console.log(decoded);
        // Create a new access token
        const newAccessToken = jwt.sign({ name: decoded.name,userId: decoded.userId }, SECRET_ACCESS_KEY, { expiresIn: '15m' });

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

app.get('/get_note/:id',verifyUser,(req,res)=>{
    console.log("User ID from verifyUser middleware:", req.userId);
    const noteId = req.params.id
    console.log(noteId+"this is note id")
    const selectNoteSql = "SELECT * from notes where user_id = ? AND id = ?"
    db.query(selectNoteSql,[req.userId,noteId],(err,result)=>{
        if(err){
            return res.status(500).json({Error: "error in db"})
        }
        if(result.length === 0){
            return res.status(404).json({Error: "No such note"})
        }
        return res.status(200).json({note: result[0]})
    })
})

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
app.post('/notes',verifyUser,(req,res)=>{
    
    const addNoteSql = "INSERT INTO notes (title,description,done,user_id) VALUES (?,?,?,?)";
    const values = [req.body.title,req.body.description,false,req.userId]
    db.query(addNoteSql,values,(err,data)=>{
        if(err){
            res.json({Error: "Error in db"});
        }
        if(data.affectedRows===0){
            res.json({error:"Couldn't add note"})
        }
        res.json({status: "Success"});
    })
})
app.put('/notes/:id', verifyUser, (req, res) => {
    const noteId = req.params.id;
    console.log(req.body.title + "<---this is the title");

    const sql = `UPDATE notes 
                 SET title = ?, description = ?, done = ?
                 WHERE id = ? AND user_id = ?`;

    db.query(sql, [req.body.title, req.body.description, req.body.done, noteId, req.userId], (err, result) => {
        if (err) {
            console.error("DB Error:", err);
            return res.status(500).json({ Error: "Error in database" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ Error: "Didn't find note or no changes made" });
        }
        return res.json({ status: "Success" });
    });
});
app.patch('/notes/:id',verifyUser,(req,res)=>{
    const noteId = req.params.id
    console.log(noteId);
    console.log("Received body: "+req.body);
    const updateDoneSql = "Update notes SET done = ? WHERE user_id = ? AND id = ?"
    db.query(updateDoneSql,[req.body.done,req.userId,noteId],(err,data)=>{
        if(err){
            return res.status(500).json({error: "error in db"});
        }
        if(data.affectedRows===0){
            return res.status(404).json({error: "can't find note in db"})
        }
        return res.status(200).json({status: "Success"});
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
