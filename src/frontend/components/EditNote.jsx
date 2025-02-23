import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import SaveButton from './SaveButton'
import {Link} from "react-router-dom";
import JoditEditor from 'jodit-react';
import { debounce } from "lodash";
import { useContext } from "react";
import { NotesContext } from "./NotesProvider";
import TailwindNav from "./TailwindNav";
import   '../joditstyles.css'
import FadeIn from "./FadeIn";
export default function EditNote(){
    const {error,getNote,darkMode,loading,setLoading} = useContext(NotesContext);
    const [note,setNote] = useState();
    const [errors,setErrors] = useState();
    const {id} = useParams()
    const config = useMemo(
        ()=>({
            theme: "custom",
            showInlineToolbar: false,
            selectionMode: 'none',
            toolbar: true,
            placeholder: "Write your note here...",
            buttons: ['bold','underline','strikeThrough','italic'],
            buttonsMD: ['bold','underline','strikeThrough','italic'],
            buttonsSM: ['bold','underline','strikeThrough','italic'],
            buttonsXS: ['bold','underline','strikeThrough','italic'],
          
            styleValues: {
              'color-text': 'white',
              'colorBorder': 'white',
              'color-panel': 'black',
            },
            style: {
           
                border: '1px solid white',
                color: '#FFF',
                fontSize: '20px'
                },
            showPoweredBy: false
    }),[])
    axios.defaults.withCredentials=true;
   
  

    useEffect(() => {
        setLoading(true);
        const fetchNote = async () => {
            try {
                const note = await getNote(id);
                setNote(note); // This sets the note after it has been fetched
            } catch (err) {
                console.error("Error in fetching note:", err);
            }
        };
        fetchNote();
    }, [loading]); // Add `id` as a dependency if it's dynamic
    const handleChange = (e) =>{
        setNote(prev=>{
            return {
                ...prev,
                [e.target.name] : e.target.value
            }
        })
    }
    const handleJoditChange = (newContent) =>{
        setNote(prev=>{
            return {
                ...prev,
                description : newContent
            }
        })
    }
   
    return (
        <div className={`font-oswald w-full min-h-screen flex flex-col ${darkMode ? 'bg-gradient-to-r from-[#020024] to-[#8a8850]' : 'bg-radial  from-[#78FFD7] to-[#007991]'}   h-screen`}>
            
          <TailwindNav/>
          {note ?  <div className='w-full h-full gap-3 my-3  flex flex-col p-3'>
            <FadeIn duration={200}>
            <input type="text" className={`outline-2 outline-white focus:outline-4 transition-all duration-200 ease-in  text-2xl font-black rounded-lg focus:ring-blue-500  block w-full  p-2.5  dark:placeholder-gray-400 dark:text-white`}  name="title" value={note.title} onChange={handleChange} />
            </FadeIn>
            { errors?.title && <p>{errors.title}</p>}
            <FadeIn duration={300}>
            <JoditEditor
        value={note.description}
        onChange={handleJoditChange}
        config={config}/>
        </FadeIn>
        
                    {errors?.description && <p>{errors.description}</p>}

            <div className="flex justify-between items-center">
                <Link to="/" className="text-3xl font-jacquard text-white">Go Back</Link>
                <SaveButton setErrors={setErrors} type="edit"  note={note}/>
            </div>

            </div>
             :
             <FadeIn duration={200}>
                             <h1 className="text-6xl text-white">Loading</h1>
             </FadeIn> 
        
        
        }
           
        </div>
    ) 
}