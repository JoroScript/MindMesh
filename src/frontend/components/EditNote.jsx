import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TailwindNav from "./TailwindNav";
import SaveButton from './SaveButton'
export default function EditNote(){
    
    const [note,setNote] = useState();
    const [error,setError] = useState(false);
    const [errors,setErrors] = useState();
    const {id} = useParams()
    console.log(id);
    console.log(note);
    axios.defaults.withCredentials=true;
    const getNote = async () => {
        try {
            const res = await axios.get(`http://localhost:5001/get_note/${id}`,{withCredentials: true});
            
            if (res.data.note) {
                setNote(res.data.note);
            } else {
                console.log("No note found", res);
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                console.log('mazna');
                await refreshAccessToken();
            }
            console.error("Error fetching note:", err);
            alert("Failed to fetch note.");
        }
    };
    const refreshAccessToken = async () => {
        try {
            await axios.get('http://localhost:5001/refresh-token', { withCredentials: true });
            getNote(); // Retry fetching user data after refreshing the token
        } catch (err) {
            console.log(err);

        }
    };

    useEffect(()=>{
        getNote();
    },[id])

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
            <input type="text" name="title" value={note.title} onChange={handleChange} />
            { errors?.title && <p>{errors.title}</p>}

            <textarea name="description" value={note.description} onChange={handleChange} />
            {errors?.description && <p>{errors.description}</p>}

            <h2>{note.done}</h2>
            </div>
            <SaveButton type="edit" setErrors={setErrors} note={note}/>
        </div>
    ) : <p>Loading .... {error ? error : ""}</p>
}