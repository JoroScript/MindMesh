import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
export default function Home(){
    const [auth,setAuth] = useState(false);
    const [message,setMessage] = useState('');
    const [name,setName] = useState('');
    console.log(auth);
    axios.defaults.withCredentials=true;

    useEffect(()=>{
        axios.get('http://localhost:5000',) // server is listening on its own port (5000, not same as front-end port)
        .then(res=>{
            if(res.data.Status==="Success"){
                setAuth(true);
                setName(res.data.name);
            }
            else {
                setAuth(false);
                setMessage(res.data.Error);
            }
        })
        .catch(err=>console.log(err));
    },[])

    const handleDelete = () =>{
        // axios.get('http://localhost:5000/logout')
        // .then(res=>{
        //     location.reload(true);
        // }).catch(err=>console.log(err));
    }

    return(
        <div className='container mt-4'>
            {
                auth ? 
                <div>
                    <h3>You are authorized {name}</h3>
                    <button className='btn btn-danger' onClick={handleDelete}>Logout</button>
                </div>
                    :
                <div>
                    <h3>{message}</h3>
                    <h3>Login Now</h3>
                    <Link to="/login">Login</Link>
                </div>
            }
        </div>
    )
}