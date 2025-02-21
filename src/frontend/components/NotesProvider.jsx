import axios from "axios";
import { createContext,useState } from "react"
import { useNavigate } from "react-router-dom";
export const NotesContext = createContext();
export default function NotesProvider({children}){

    const [error,setError] = useState(false);
    const [loading,setLoading] = useState(true);
    const [notes, setNotes] = useState(false);
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5001/notes', { withCredentials: true });
            console.log("this is the resp ->"+response.data.notes)
            setNotes(response.data.notes);
            setLoading(false);
        } catch (err) {
            // If the token has expired or is invalid, try refreshing the access token
            if (err.response && err.response.status === 401) {
                console.log('refreshing access token')
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

    return(
        <NotesContext.Provider value={{error,loading,notes,fetchData,handleLogout}}>
            {children}
        </NotesContext.Provider>
    )
}