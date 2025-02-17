import  { useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MenuButton from './MenuButton';

const Home = () => {
    const [notes, setNotes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
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
    const handleLogout =  async () =>{
        try {
            await axios.get('http://localhost:5001/logout', { withCredentials: true });
            navigate('/login');
        } catch (err) {
            setError('Error logging out'+err);
        }
    }

    const notesElements = notes && notes.map(note=>{
      return  <div key={note.id} className='font-roboto'>
            <h1>{note.title}</h1>
            <p>{note.description}</p>
            <p>{note.done ? "done" : "undone"}</p>
        </div>
    }) 
    // Effect to fetch user data on mount
    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='w-full min-h-screen h-screen bg-violet-900 '>
            <header>

            <nav className='w-full font-jacquard gap-3   p-3 flex bg-violet-600 items-center justify-between  shadow-2xl '>
                <div className=' flex items-center'>
                    <SearchIcon fontSize='large'  className='text-stone-100' />
                    <input placeholder='search' className=' hover:border-2  p-2 w-11/12 placeholder:font-black text-red-400 text-xl rounded border-stone-900' />
                </div>
                
                 <MenuButton logout={handleLogout} />
               
            </nav>

            </header>
            <main className='flex items-center justify-center w-11/12 mx-auto p-2 bg-teal-300'>
            {notesElements}
            </main>
            
        </div>
    );
};

export default Home;
