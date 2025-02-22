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
    const {error,getNote} = useContext(NotesContext);
    const [note,setNote] = useState();
    const [errors,setErrors] = useState();
    const {id} = useParams()
    const config = useMemo(
        ()=>({
            
            toolbar: true,
            placeholder: "Write your note here...",
            buttons: ['bold','underline','strikeThrough','italic'],
            buttonsMD: ['bold','underline','strikeThrough','italic'],
            buttonsSM: ['bold','underline','strikeThrough','italic'],
            buttonsXS: ['bold','underline','strikeThrough','italic'],
          
            styleValues: {
              'color-text': 'white',
              'colorBorder': 'white',
              'color-panel': '#3b82f6',
            },
            style: {
                background: 'radial-gradient(at 50% 75%, #80d4ff, #3b82f6, #1e3a8a 90%)',
                border: '1px solid white',
                color: '#FFF',
                fontSize: '20px'
                },
            showPoweredBy: false
    }),[])
    console.log(id);
    console.log(note);
    axios.defaults.withCredentials=true;
   
  

    useEffect(()=>{
        const fetchNote = async () => {
            const note = await getNote(id);
            setNote(note);
        };
        fetchNote();
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
        <div className=' w-full min-h-screen flex flex-col items-center h-screen bg-radial  from-[#78FFD7] to-[#007991]'>

            <nav className='w-full   gap-3   p-3 flex bg-radial  from-[#78FFD7] to-[#007991] items-center justify-between  shadow-2xl '>
            <h1 className="text-white text-5xl">Editing Note</h1>
             <MenuButton/>
            </nav>
            <div className='w-full h-full gap-3 my-3  flex flex-col p-3'>
            <input type="text" className="bg-radial-[at_50%_75%] from-sky-200 via-blue-400 to-indigo-900 to-90% outline-2 outline-white focus:outline-4 transition-all duration-200 ease-in  text-2xl font-black rounded-lg focus:ring-blue-500  block w-full  p-2.5 dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white"  name="title" value={note.title} onChange={handleChange} />
            { errors?.title && <p>{errors.title}</p>}

            <JoditEditor
        value={note.description}
        onChange={handleJoditChange}
        config={config}/>
        
                    {errors?.description && <p>{errors.description}</p>}

            <div className="flex justify-between items-center">
                <Link to="/" className="text-3xl font-jacquard text-white">Go Back</Link>
                <SaveButton setErrors={setErrors} type="edit"  note={note}/>
            </div>

            </div>
        </div>
    ) : <p>Loading .... {error ? error : ""}</p>
}