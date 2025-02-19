import  { useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate,Link} from 'react-router-dom';
import TailwindNav from './components/TailwindNav'
import NoteCard from './components/NoteCard';
const Home = () => {
    const [notes, setNotes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [searchValue,setSearchValue] = useState('');

    console.log(notes);
    axios.defaults.withCredentials = true;
    // Function to fetch user data from the server
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5001/notes', { withCredentials: true });
            console.log("this is the resp ->"+response.data.notes)
            setNotes(response.data.notes);
            setLoading(false);
        } catch (err) {
            // If the token has expired or is invalid, try refreshing the access token
            if (err.response && err.response.status === 401) {
                console.log('mazna');
                await refreshAccessToken();
            } else {
                setError('Error fetching user data');

                setLoading(false);
            }
        }
    };

    // Function to refresh access token
    const refreshAccessToken = async () => {
        try {
            await axios.get('http://localhost:5001/refresh-token', { withCredentials: true });
            fetchData(); // Retry fetching user data after refreshing the token
        } catch (err) {
            setError('Session expired, please log in again'+err);
            setLoading(false);
        }
    };
 
    
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

    return (
        <div className='min-h-screen bg-sky-300 w-full max-w-full flex flex-col overflow-x-hidden'>
        <div className='w-full max-w-full min-h-screen flex flex-col'>
           <TailwindNav setSearchValue={setSearchValue} searchValue={searchValue} setError={setError} />

            <main className='flex md:flex-row grow md:content-start lg:content-center    md:flex-wrap md:gap-6 lg:flex-row lg:flex-wrap lg:gap-6 gap-y-6 lg:p-6    p-3 bg-sky-300 lg:items-start lg:justify-center w-full items-center justify-center my-6 flex-col'>
            {notesElements}
            </main>
           
            
        </div>
        </div>
    );
};

export default Home;
