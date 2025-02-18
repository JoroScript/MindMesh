import axios from "axios";
import {useState } from "react";
import TailwindNav from "./TailwindNav";
import SaveButton from './SaveButton'
export default function AddNote(){
    
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
    return note ? (
        <div className='w-full min-h-screen h-screen bg-violet-900 '>

            <TailwindNav setError={setError}/>
            <div className='w-full bg-red-500 gap-3 my-3 flex flex-col p-3'>
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" value={note.title} onChange={handleChange} />
            { errors?.title && <p>{errors.title}</p>}

            <textarea name="description" placeholder="Note description..." value={note.description} onChange={handleChange} />
            {errors?.description && <p>{errors.description}</p>}

            </div>
            <SaveButton type="add" setErrors={setErrors} note={note}/>
        </div>
    ) : <p>Loading .... {error ? error : ""}</p>
}