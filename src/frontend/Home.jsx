import  { useEffect, useState } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import TailwindNav from './components/TailwindNav'
import NoteCard from './components/NoteCard';
import { useContext } from 'react';
import { NotesContext } from './components/NotesProvider';
import FadeIn from './components/FadeIn';
const Home = () => {
    const {notes,loading,error,fetchData,darkMode} = useContext(NotesContext);
    const [searchValue,setSearchValue] = useState('');      
    
    axios.defaults.withCredentials = true;

 
    
        const notesElements = notes ?  searchValue ? notes.filter(note=>note.title.toLowerCase().startsWith(searchValue.toLowerCase())).map(note=>{
            return <NoteCard key={note.id} thisNote={note} />

        }) : notes.map(note=>{
           return <NoteCard key={note.id} thisNote={note} />
        }) : "";
    
   
     
    // Effect to fetch user data on mount
    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>
            {error}
            <Link to="/login">Login</Link>
            </div>;
    }
    console.log(darkMode);
    return (
        <div className={`${darkMode ? 'bg-gradient-to-r from-[#020024] to-[#8a8850]' : 'bg-radial  from-[#78FFD7] to-[#007991]'}  min-h-screen    w-full max-w-full flex flex-col overflow-x-hidden`}>
        <div className='w-full max-w-full min-h-screen flex flex-col'>
           <TailwindNav setSearchValue={setSearchValue} searchValue={searchValue} />

            <main className='flex md:flex-row  md:content-start lg:content-center     md:flex-wrap md:gap-6 lg:flex-row lg:flex-wrap lg:gap-6 gap-y-6 lg:p-6    p-3  lg:items-start lg:justify-center w-full items-center justify-center my-6 flex-col'>
            {notesElements}
            </main>
           
            
        </div>
        </div>
    );
};

export default Home;
