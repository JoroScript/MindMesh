import axios from "axios";
import {useMemo, useState } from "react";
import SaveButton from './SaveButton'
import {Link} from "react-router-dom";
import JoditEditor from 'jodit-react';
import { debounce } from "lodash";
import { useContext } from "react";
import { NotesContext } from "./NotesProvider";
import TailwindNav from "./TailwindNav";
import   '../joditstyles.css'
export default function AddNote(){
    const {error,darkMode} = useContext(NotesContext);
    const [note,setNote] = useState({title: "",description: ""});
    const [errors,setErrors] = useState();
    const config = useMemo(
        ()=>({
            theme: "custom",
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
   console.log(error)
    return  (
        <div className={`font-oswald w-full min-h-screen flex flex-col ${darkMode ? 'bg-gradient-to-r from-[#020024] to-[#8a8850]' : 'bg-radial  from-[#78FFD7] to-[#007991]'}   h-screen`}>

          <TailwindNav/>
            <div className='w-full h-full gap-3 my-3  flex flex-col p-3'>
            <input type="text" className={`outline-2 outline-white focus:outline-4 transition-all duration-200 ease-in  text-2xl font-black rounded-lg focus:ring-blue-500  block w-full  p-2.5  dark:placeholder-gray-400 dark:text-white`}  name="title" value={note.title} onChange={handleChange} />
            { errors?.title && <p>{errors.title}</p>}

            <JoditEditor
        value={note.description}
        onChange={handleJoditChange}
        config={config}/>
        
                    {errors?.description && <p>{errors.description}</p>}

            <div className="flex justify-between items-center">
                <Link to="/" className="text-3xl font-jacquard text-white">Go Back</Link>
                <SaveButton setErrors={setErrors} type="add"  note={note}/>
            </div>

            </div>
        </div>
    )  
}