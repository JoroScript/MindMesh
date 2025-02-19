import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
export default function MenuButton({logout}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button 
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <span 
          className={`transition-all duration-300 ease-in-out ${open ? "rotate-180 text-red-500" : "rotate-0 text-white"}`}
        >
          {open ? <CloseIcon fontSize='large'  /> : <MenuIcon fontSize='large' />}
        </span>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>
          <Link className='hover:underline' to="/add"><NoteAddIcon/>  Add Note</Link>
        </MenuItem>
        <MenuItem onClick={()=>{
          handleClose();
          logout();
        }}>
          <Link className='hover:underline' to="/login"><LogoutIcon/>  Logout</Link>
        </MenuItem>
      </Menu>
    </div>
  );
}