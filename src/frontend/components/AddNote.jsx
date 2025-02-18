import axios from "axios";
import {useState } from "react";
import SaveButton from './SaveButton'
import MenuButton from "./MenuButton";
import { useNavigate,Link } from "react-router-dom";
export default function AddNote(){
    const navigate=useNavigate();
    const [note,setNote] = useState({title: "", description: ""});
    const [error,setError] = useState(false);
    const [errors,setErrors] = useState();
    console.log(note);
    axios.defaults.withCredentials=true;

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5001/', { withCredentials: true });
        } catch (err) {
            // If the token has expired or is invalid, try refreshing the access token
            if (err.response && err.response.status === 401) {
                console.log('mazna');
                await refreshAccessToken();
            } else {
                setError('Error fetching user data');
            }
        }
    };

    // Function to refresh access token
    const refreshAccessToken = async () => {
        try {
            await axios.get('http://localhost:5001/refresh-token', { withCredentials: true });
            fetchData(); // Retry fetching user data after refreshing the token
        } catch (err) {
            setError('Session expired, please log in again'+err);
        }
    };

    const handleChange = (e) =>{
        setNote(prev=>{
            return {
                ...prev,
                [e.target.name] : e.target.value
            }
        })
    }

    const handleLogout =  async () =>{
        try {
            await axios.get('http://localhost:5001/logout', { withCredentials: true });
            navigate('/login');
        } catch (err) {
            setError('Error logging out'+err);
        }
    }
    return note ? (
        <div className='w-full min-h-screen  p-6 h-screen bg-violet-900 '>

        <nav className='w-full font-jacquard gap-3   p-3 flex bg-violet-600 items-center justify-between  shadow-2xl '>
        <h1 className="text-white text-5xl">Adding Note</h1>
        <MenuButton logout={handleLogout} />
        </nav>
        <div className='w-full h-4/6 bg-red-500 gap-3 my-3  flex flex-col p-3'>
        <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  name="title" value={note.title} onChange={handleChange} />
        { errors?.title && <p>{errors.title}</p>}

        <textarea className="h-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" name="description" value={note.description} onChange={handleChange} />
        {errors?.description && <p>{errors.description}</p>}
        <div className="flex justify-between items-center">
        <Link to="/" className="text-3xl font-jacquard text-white">Go Back</Link>
        <SaveButton type="add" setErrors={setErrors} note={note}/>
        </div>

        </div>
    </div>
    ) : <p>Loading .... {error ? error : ""}</p>
}