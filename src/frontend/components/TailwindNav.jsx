import SearchIcon from '@mui/icons-material/Search';
import MenuButton from './MenuButton';
import FadeIn from './FadeIn';
export default function TailwindNav({setSearchValue,searchValue}){


    return(
        <header>
        <nav className='w-full gap-3 p-3 flex  bg-radial from-[#78FFD7] to-[#007991]  items-center justify-between  shadow-2xl '>
            
            <div className=' flex items-center'>
                <FadeIn duration={300}>
                <div className='hover:scale-[120%] transition-transform ease-in-out duration-300 hover:cursor-pointer'>
                <SearchIcon  fontSize='large'  className='text-white ' />
                </div>
                </FadeIn>
                <FadeIn duration={350}>
                <input placeholder='search'   onChange={e=>setSearchValue(e.target.value)} value={searchValue} className='h-10 w-11/12 border-2 focus:outline-white text-white transition-all duration-300 focus:w-full p-2  placeholder:font-black text-xl rounded border-white outline-white ' />
                </FadeIn>
               
            </div>
            <FadeIn duration={400}>
            <MenuButton/>
            </FadeIn>
           
        </nav>

        </header>
    )
}