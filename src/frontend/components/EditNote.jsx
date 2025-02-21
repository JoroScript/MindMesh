import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import SaveButton from './SaveButton'
import MenuButton from "./MenuButton";
import {Link} from "react-router-dom";
import JoditEditor from 'jodit-react';
import { debounce } from "lodash";
import { useContext } from "react";
import { NotesContext } from "./NotesProvider";
export default function EditNote(){
    const {error} = useContext(NotesContext);
    const [note,setNote] = useState();
    const [errors,setErrors] = useState();
    const {id} = useParams()
    const config = useMemo(
        ()=>({
            toolbar: true,
            placeholder: "Write your note here...",
            buttons: ['bold','underline','strikeThrough','italic'],
            styleValues: {
              'color-text': 'white',
              'colorBorder': 'white',
              'color-panel': 'white',
            }
    }),[])
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
    },[])

    const handleChange = (e) =>{
        setNote(prev=>{
            return {
                ...prev,
                [e.target.name] : e.target.value
            }
        })
    }
    const handleJoditChange = debounce((newContent) =>{
        setNote(prev=>{
            return {
                ...prev,
                description : newContent
            }
        })
    },300)
   
    return note ? (
        <div className='w-full min-h-screen flex flex-col items-center h-screen bg-violet-900 '>

            <nav className='w-full  font-jacquard gap-3   p-3 flex bg-violet-600 items-center justify-between  shadow-2xl '>
            <h1 className="text-white text-5xl">Editing Note</h1>
             <MenuButton/>
            </nav>
            <div className='w-full h-full gap-3 my-3  flex flex-col p-3'>
            <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-2xl font-black rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  name="title" value={note.title} onChange={handleChange} />
            { errors?.title && <p>{errors.title}</p>}

            <JoditEditor
        value={note.description}
        onChange={handleJoditChange}
        config={config}
       className="bg-violet-300"
/>            {errors?.description && <p>{errors.description}</p>}

            <div className="flex justify-between items-center">
                <Link to="/" className="text-3xl font-jacquard text-white">Go Back</Link>
                <SaveButton setErrors={setErrors} type="edit" note={note}/>
            </div>

            </div>
        </div>
    ) : <p>Loading .... {error ? error : ""}</p>
}