import axios from "axios";
import { createContext,useState } from "react"
import { useNavigate } from "react-router-dom";
export const NotesContext = createContext();
export default function NotesProvider({children}){

    const [error,setError] = useState(false);
    const [loading,setLoading] = useState(true);
    const [notes, setNotes] = useState(false);
    const [darkMode,setDarkMode] = useState(false);
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
                await refreshAccessToken(fetchData);
            } else {
                setError('Error fetching user data');

                setLoading(false);
            }
        }
    };
    //function to update note done state
    const handleDone =  async (e)=>{
        const doneState = e.target.checked ? 1 : 0;
        console.log(doneState);
        try{
            const res = await axios.patch(`http://localhost:5001/notes/${note.id}`,{done: doneState},{withCredentials: true})
            console.log(res+"this is res")
            if(res.data.status==="Success"){
                return e.target.checked
            }
            
        }
        catch(err){
         // If the token has expired or is invalid, try refreshing the access token
         if (err.response && err.response.status === 401) {
          console.log('refreshing access token')
          await refreshAccessToken(handleDone);
      } else {
          // setError('Error fetching user data');
          console.log(err);
          // setLoading(false);
      }
        }
        
    }
    //----

    // Function to refresh access token
    const refreshAccessToken = async (resetFunc) => {
        try {
            await axios.get('http://localhost:5001/refresh-token', { withCredentials: true });
            resetFunc(); // Retry fetching user data after refreshing the token
        } catch (err) {
            setError('Session expired, please log in again'+err);
            setLoading(false);
        }
    };
    //get single note
    const getNote = async (id) => {
        try {
            const res = await axios.get(`http://localhost:5001/get_note/${id}`,{withCredentials: true});

            if (res.data.note) {
                return res.data.note
            } else {
                console.log("No note found", res);
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                console.log('mazna');
                await refreshAccessToken(getNote);
            }
            console.error("Error fetching note:", err);
        }
    };
    //


    const handleLogout =  async () =>{
        try {
            await axios.get('http://localhost:5001/logout', { withCredentials: true });
            navigate('/login');
        } catch (err) {
            setError('Error logging out'+err);
        }
    }


    return(
        <NotesContext.Provider value={{error,loading,notes,fetchData,handleLogout,refreshAccessToken,getNote,darkMode,setDarkMode}}>
            {children}
        </NotesContext.Provider>
    )
}