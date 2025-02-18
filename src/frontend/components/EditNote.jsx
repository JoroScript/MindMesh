import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SaveButton from './SaveButton'
import MenuButton from "./MenuButton";
import { useNavigate,Link} from "react-router-dom";
export default function EditNote(){
    const navigate = useNavigate();
    const [note,setNote] = useState();
    const [error,setError] = useState(false);
    const [errors,setErrors] = useState();
    const {id} = useParams()
    console.log(id);
    console.log(note);
    axios.defaults.withCredentials=true;
    const getNote = async () => {
        try {
            const res = await axios.get(`http://localhost:5001/get_note/${id}`,{withCredentials: true});
            
            if (res.data.note) {
                setNote(res.data.note);
            } else {
                console.log("No note found", res);
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                console.log('mazna');
                await refreshAccessToken();
            }
            console.error("Error fetching note:", err);
            alert("Failed to fetch note.");
        }
    };
    const refreshAccessToken = async () => {
        try {
            await axios.get('http://localhost:5001/refresh-token', { withCredentials: true });
            getNote(); // Retry fetching user data after refreshing the token
        } catch (err) {
            console.log(err);

        }
    };

    useEffect(()=>{
        getNote();
    },[id])

    const handleChange = (e) =>{
        setNote(prev=>{
            return {
                ...prev,
                [e.target.name] : e.target.value
            }
        })
    }
    const handleLogout =  async () =>{
        try {
            await axios.get('http://localhost:5001/logout', { withCredentials: true });
            navigate('/login');
        } catch (err) {
            setError('Error logging out'+err);
        }
    }
    return note ? (
        <div className='w-full min-h-screen  p-6 h-screen bg-violet-900 '>

            <nav className='w-full font-jacquard gap-3   p-3 flex bg-violet-600 items-center justify-between  shadow-2xl '>
            <h1 className="text-white text-5xl">Editing Note</h1>
             <MenuButton logout={handleLogout} />
            </nav>
            <div className='w-full h-4/6 bg-red-500 gap-3 my-3  flex flex-col p-3'>
            <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  name="title" value={note.title} onChange={handleChange} />
            { errors?.title && <p>{errors.title}</p>}

            <textarea className="h-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" name="description" value={note.description} onChange={handleChange} />
            {errors?.description && <p>{errors.description}</p>}

            <div className="flex justify-between items-center">
                <Link to="/" className="text-3xl font-jacquard text-white">Go Back</Link>
                <SaveButton type="edit" setErrors={setErrors} note={note}/>
            </div>

            </div>
        </div>
    ) : <p>Loading .... {error ? error : ""}</p>
}