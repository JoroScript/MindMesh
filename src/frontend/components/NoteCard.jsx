import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Switch } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import FadeIn from './FadeIn';
export default function NoteCard({thisNote}){
    const [done,setDone] = useState(false)
    const [note,setNote] = useState(null);
    console.log(note);
    axios.defaults.withCredentials=true;
    useEffect(()=>{
        setNote(thisNote);
        setDone(thisNote.done);
    },[thisNote])
  
    const handleDone =  async (e)=>{
        const doneState = e.target.checked ? 1 : 0;
        console.log(doneState);
        try{
            const res = await axios.patch(`http://localhost:5001/notes/${note.id}`,{done: doneState},{withCredentials: true})
            console.log(res+"this is res")
            if(res.data.status==="Success"){
                setDone(e.target.checked)
            }
        }
        catch(err){
            console.log(err);
        }
        
    }
    return note && (
        <div  className="w-full lg:w-[48%] md:w-[48%]   lg:p-8 lg:h-80   max-w-full flex flex-col px-4 py-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <div className='flex flex-col gap-3 mb-3'>
        <FadeIn  duration={150}>
        <h1 className="text-3xl  line-clamp-1 font-bold tracking-tight text-gray-900 dark:text-white">{note.title}</h1>
        </FadeIn>
        <FadeIn duration={250}>
        <h2 className={  `${done ? 'text-green-300 text-2xl  font-black' : 'text-lg text-red-500 font-black'}`}>- {done ? "done" : "to do"}</h2>
        </FadeIn>
        </div>   

        
    <FadeIn duration={200}>
   <p className="font-normal text-gray-300 lg:text-xl line-clamp-3">{note.description}</p>
   </FadeIn>
   <div className='flex items-center mt-auto justify-between'>
    <FadeIn duration={250}>
   <Switch 
        onChange={handleDone}
  size="medium"
  defaultChecked={done}
  icon={
    <CloseIcon
      sx={{
        color: "red",
        backgroundColor: "white", // Ensure visibility
        borderRadius: "50%", // Keep it circular
        padding: "2px", // Add spacing if needed
      }}
    />
  }
  checkedIcon={
    <DoneIcon
      sx={{
        color: "green",
        backgroundColor: "white", // Ensure visibility
        borderRadius: "50%", // Keep it circular
        padding: "2px", // Add spacing if needed
      }}
    />
  }
  sx={{
    "& .MuiSwitch-track": {
      backgroundColor: "red", // Adjust track color when unchecked
    },
    "& .Mui-checked + .MuiSwitch-track": {
      backgroundColor: "lightgreen !important", // Adjust track color when checked
    },
  }}
/>
</FadeIn>
        <div className='hover:bg-gray-700 flex text-gray-200 bg-gray-800  p-2 gap-3'>
            <FadeIn duration={300}>
                    <Link to={`/edit/${note.id}`}>Edit</Link>
            </FadeIn>
            <FadeIn duration={350}>
            <Link to={`/read/${note.id}`}>Read</Link>
            </FadeIn>
            <FadeIn duration={400}>
            <Link >Delete</Link>
            </FadeIn>
            </div>
            </div>
        </div>
        
    )
}


{/* <div className='w-full bg-red-500 gap-3 my-3 flex flex-col p-3'>
<h1 className='text-center text-3xl'>{note.title}</h1>
<p className='line-clamp-3'>{note.description}</p>
<div className='flex bg-teal-300 ml-auto p-2 gap-3'>
<Link to={`/edit/${note.id}`}>Edit</Link>
<Link to={`/read/${note.id}`}>Read</Link>
<Link >Delete</Link>
</div>
</div>  */}