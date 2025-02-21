import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { green } from '@mui/material/colors';
import Fab from '@mui/material/Fab';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom';
export default function SaveButton({setErrors,note,type}) {
    console.log(note);
    const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
axios.defaults.withCredentials=true;
  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      '&:hover': {
        bgcolor: green[700],
      },
    }),
  };
  const validationSchema = Yup.object({
    title: Yup.string().required("Title Field is Required"),
    description: Yup.string().required("Description Field is Required").min(10,"Description must be at least 10 characters long")
  })
  


  const handleButtonClick = async () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      try{        
         await validationSchema.validate({title: note.title, description: note.description},{abortEarly: false})     

        // If validation passes, proceed with the request
        const res = type==="edit" ? await axios.put(`http://localhost:5001/notes/${note.id}`,{...note},{withCredentials: true}) : 
        await axios.post('http://localhost:5001/notes',{title: note.title,description: note.description})
        if(res.data.status==="Success"){
            setLoading(false);
            setSuccess(true);
            setErrors(false);
            setTimeout(() => {
                navigate('/')
            }, 1000);
        }
        else console.log(res.data);
      }
      catch(error){
        setLoading(false);
        setSuccess(false);
        if (error.inner) {  // to know  error is from Yup validation - error.inner are all yup errors with the path and message pairs (input and its message)
                
            const newErrors = {};
            error.inner.forEach(err => { 
                newErrors[err.path] = err.message; // path is the name of the input field 
            });
            setErrors(newErrors);
        } else {
            console.log(error); // Handle other errors (not from yup since not .inner)
        }
      }
      
        
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ m: 1, position: 'relative' }}>
        <Fab
          aria-label="save"
          color="primary"
          sx={buttonSx}
          onClick={handleButtonClick}
        >
          {success ? <CheckIcon /> : <SaveIcon />}
        </Fab>
        {loading && (
          <CircularProgress
            size={68}
            sx={{
              color: green[500],
              position: 'absolute',
              top: -6,
              left: -6,
              zIndex: 1,
            }}
          />
        )}
      </Box>
    </Box>
  );
}
