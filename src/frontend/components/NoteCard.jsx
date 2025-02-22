import { useEffect,useState } from 'react';
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
      <div className="bg-radial hover:scale-[102%] from-[#78FFD7] to-[#007991] 
      hover:opacity-90 transition-all duration-300 ease-in-out 
      w-full lg:w-[48%] md:w-[48%] lg:p-8 lg:h-80 max-w-full 
      flex flex-col px-4 py-6 rounded-xl 
      shadow-xl shadow-cyan-600 hover:shadow-cyan-200 
      hover:shadow-[0_0_10px_2px_white]">
        <div className='flex flex-col gap-3 mb-3'>
        <FadeIn  duration={150}>
        <h1 className={`lg:text-4xl text-2xl   line-clamp-1  font-bold tracking-tight  transparent transition delay-50 duration-150  decoration-transparent    ${done ? "line-through decoration-white  text-white" : "text-white"}`}>{note.title}</h1>
        </FadeIn>
        <FadeIn duration={250}>
        <h2 className={  `text-lg font-black ${done ? 'text-green-300 text-2xl  ' : 'text-lg text-red-500'}`}>- {done ? "done" : "to do"}</h2>
        </FadeIn>
        </div>   

        
    <FadeIn duration={200}>
    <div
          className="text-white line-clamp-1 text-xl lg:text-2xl"
          dangerouslySetInnerHTML={{ __html: note.description }}
        ></div>   </FadeIn>
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
        padding: "3px", // Add spacing if needed
      }}
    />
  }
  checkedIcon={
    <DoneIcon
      sx={{
        color: "green",
        backgroundColor: "white", // Ensure visibility
        borderRadius: "50%", // Keep it circular
        padding: "3px", // Add spacing if needed
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
    "&:hover": { backgroundColor: "transparent" } // Remove hover effect

  }}
/>
</FadeIn>
        <div className=' flex text-white lg:text-2xl  p-2 gap-3'>
            <FadeIn duration={300}>
                    <Link className=" relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[3px] after:bg-white after:scale-x-0 after:origin-left after:transition-transform after:duration-500 hover:after:scale-x-100" to={`/edit/${note.id}`}>Edit</Link>
            </FadeIn>
            <FadeIn duration={350}>




            <Link className="relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[3px] after:scale-x-0 after:bg-white after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-400" to={`/read/${note.id}`}>Read</Link>
            </FadeIn>
            <FadeIn duration={400}>







            <Link className="relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:origin-left after:w-full after:h-[3px] after:scale-x-0 after:bg-white after:transition-transform after:origin left after:duration-500 hover:after:scale-x-100" >Delete</Link>
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