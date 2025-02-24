import SearchIcon from '@mui/icons-material/Search';
import MenuButton from './MenuButton';
import FadeIn from './FadeIn';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { useContext } from 'react';
import { NotesContext } from './NotesProvider';
import DarkModeSwitch from './DarkModeSwitch';

export default function TailwindNav({setSearchValue,searchValue}){
    const navigate = useNavigate();
    const location = useLocation();
    console.log(location);
    const {handleLogout,darkMode} = useContext(NotesContext);
    return(
        <header>
        <nav className={`w-full  ${darkMode ? 'bg-gradient from-[#020024] border-b-2 border-white  to-[#8a8850]' : 'bg-radial from-[#78FFD7] b to-[#007991]'}  font-oswald gap-3 p-3 flex  items-center justify-between  shadow-2xl`}>
            
            <div className={` ${location.pathname==="/" ? 'flex' : 'hidden'} items-center`}>
                <FadeIn duration={300}>
                <div className='hover:scale-[120%] transition-transform ease-in-out duration-300 hover:cursor-pointer'>
                <SearchIcon  fontSize='large'  className='text-white'/>
                </div>
                </FadeIn>
                <FadeIn duration={350}>
                <input placeholder='search'   onChange={e=>setSearchValue(e.target.value)} value={searchValue} className='font-oswald h-10 w-11/12 border-2 focus:outline-white text-white transition-all duration-300 focus:w-full p-2  placeholder:font-black text-xl rounded border-white outline-white ' />
                </FadeIn>
            </div>
            {location.pathname!=="/" && <h1 className='text-white text-3xl'>{location.pathname.startsWith('/edit') ? "Editing Note" : "Adding note"}</h1>}
            <FadeIn duration={300}>
                <DarkModeSwitch/>
                </FadeIn>
            <FadeIn duration={400}>
           <div className='lg:hidden'> <MenuButton/></div>
          
           <div className='lg:flex gap-5  hidden'>
           <button className=" relative cursor-pointer font-black text-xl hover:scale-[110%]  transition-transform duration-200 ease-in-out text-white p-2  after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[3px] after:bg-white after:scale-x-0 after:origin-left after:transition-transform after:duration-500 hover:after:scale-x-100 hidden lg:inline-block"  onClick={()=>navigate('/add')}><NoteAddIcon/>  Add Note</button>
           <button className=" relative cursor-pointer font-black text-xl hover:scale-[110%]  transition-transform duration-200 ease-in-out text-white p-2  after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[3px] after:bg-white after:scale-x-0 after:origin-left after:transition-transform after:duration-500 hover:after:scale-x-100 hidden lg:inline-block"  onClick={()=>handleLogout()}><LogoutIcon/>Logout</button>
           </div>
            </FadeIn>
           
        </nav>

        </header>
    )
}