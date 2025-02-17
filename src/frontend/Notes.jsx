import  { useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate } from 'react-router-dom';

const Notes = () => {
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;
    // Function to fetch user data from the server
    const fetchUserData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/', { withCredentials: true });
            setUserName(response.data.name);
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
            await axios.get('http://localhost:5000/refresh-token', { withCredentials: true });
            fetchUserData(); // Retry fetching user data after refreshing the token
        } catch (err) {
            setError('Session expired, please log in again'+err);
            setLoading(false);
        }
    };
    const handleLogout =  async () =>{
        try {
            await axios.get('http://localhost:5000/logout', { withCredentials: true });
            navigate('/login');
        } catch (err) {
            setError('Error logging out'+err);
        }
    }

    // Effect to fetch user data on mount
    useEffect(() => {
        fetchUserData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1 className='text-teal-700 font-black'>Welcome, {userName}!</h1>
            <button onClick={handleLogout}>Log Out</button>
        </div>
    );
};

export default Notes;
