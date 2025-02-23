import axios from "axios";
import {useState } from "react";
import SaveButton from './SaveButton'
import MenuButton from "./MenuButton";
import { useNavigate,Link } from "react-router-dom"; 
export default function AddNote(){
    const navigate=useNavigate();
    console.log('hello');
    const [note,setNote] = useState({title: "", description: ""});
    const [error,setError] = useState(false);
    const [errors,setErrors] = useState();
    console.log(note);
    axios.defaults.withCredentials=true;

  
    // Function to refresh access token
  

    const handleChange = (e) =>{
        setNote(prev=>{
            return {
                ...prev,
                [e.target.name] : e.target.value
            }
        })
    }
    return note ? (
        <div className='font-oswald w-full min-h-screen  p-6 h-screen bg-violet-900 '>

        <nav className='w-full font-jacquard gap-3   p-3 flex bg-violet-600 items-center justify-between  shadow-2xl '>
        <h1 className="text-white text-5xl">Adding Note</h1>
        <MenuButton/>
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