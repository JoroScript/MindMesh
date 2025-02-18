import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
export default function NoteCard({thisNote}){
    const [note,setNote] = useState(null);
    console.log(note);
    
    useEffect(()=>{
        setNote(thisNote);
    },[thisNote])

    
    return note && (
         <div className='w-full bg-red-500 gap-3 my-3 flex flex-col p-3'>
            <h1 className='text-center text-3xl'>{note.title}</h1>
            <p className=''>{note.description}</p>
            <div className='flex bg-teal-300 ml-auto p-2 gap-3'>
            <Link to={`/edit/${note.id}`}>Edit</Link>
            <Link to={`/read/${note.id}`}>Read</Link>
            <Link >Delete</Link>
            </div>
        </div> 
    )
}