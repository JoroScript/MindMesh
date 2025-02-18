import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
export default function NoteCard({thisNote}){
    const [note,setNote] = useState(null);
    console.log(note);
    
    useEffect(()=>{
        setNote(thisNote);
    },[thisNote])

    
    return note && (
        <div  className="w-full flex flex-col p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">

        <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{note.title}</h1>
        <p className="font-normal text-gray-300 line-clamp-3">{note.description}</p>
        <div className='hover:bg-gray-700 flex text-gray-200 bg-gray-800 ml-auto p-2 gap-3'>
                    <Link to={`/edit/${note.id}`}>Edit</Link>
                    <Link to={`/read/${note.id}`}>Read</Link>
                    <Link >Delete</Link>
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