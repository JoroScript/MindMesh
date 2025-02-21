import SearchIcon from '@mui/icons-material/Search';
import MenuButton from './MenuButton';
import axios from 'axios';
import FadeIn from './FadeIn';
import { useContext } from 'react';
import { NotesContext } from './NotesProvider';
export default function TailwindNav({setSearchValue,searchValue}){

   const {handleLogout} = useContext(NotesContext);

    return(
        <header>
        <nav className='w-full gap-3   p-3 flex bg-cyan-500  items-center justify-between  shadow-2xl '>
            
            <div className=' flex items-center'>
                <FadeIn duration={300}>
                <SearchIcon fontSize='large'  className='text-stone-100' />
                </FadeIn>
                <FadeIn duration={350}>
                <input placeholder='search'   onChange={e=>setSearchValue(e.target.value)} value={searchValue} className='h-10 w-11/12 border-2 focus:outline-white  transition-all duration-300 focus:w-full p-2  placeholder:font-black text-xl rounded border-white outline-white ' />
                </FadeIn>
               
            </div>
            <FadeIn duration={400}>
            <MenuButton logout={handleLogout} />
            </FadeIn>
           
        </nav>

        </header>
    )
}