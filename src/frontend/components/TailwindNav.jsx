import SearchIcon from '@mui/icons-material/Search';
import MenuButton from './MenuButton';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function TailwindNav({setError}){
    const navigate = useNavigate();
    const handleLogout =  async () =>{
        try {
            await axios.get('http://localhost:5001/logout', { withCredentials: true });
            navigate('/login');
        } catch (err) {
            setError('Error logging out'+err);
        }
    }
    return(
        <header>

        <nav className='w-full font-jacquard gap-3   p-3 flex bg-violet-600 items-center justify-between  shadow-2xl '>
            <div className=' flex items-center'>
                <SearchIcon fontSize='large'  className='text-stone-100' />
                <input placeholder='search' className=' hover:border-2  p-2 w-11/12 placeholder:font-black text-red-400 text-xl rounded border-stone-900' />
            </div>
            
             <MenuButton logout={handleLogout} />
           
        </nav>

        </header>
    )
}