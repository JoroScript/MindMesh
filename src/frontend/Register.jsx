
import axios from "axios"
import { useState } from "react"
import { Link,useNavigate} from "react-router-dom"
import * as Yup from 'yup';

export default function Register(){
    const navigate=useNavigate();
    const [values,setValues] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [errors,setErrors] =useState({});
    const validationSchema = Yup.object({
        //the names of these properties must match the names of the values (form) properties
        name: Yup.string().required("Name is required"),
        //every property in the schema object creates a path --> later used to handle error paths and their corresponding messages
        email: Yup.string().required("Email is required").email("Invalid Email Format"),

        password: Yup.string().required("Password is required").min(8,"Password must be at least 8 characters")
        .matches(
            /[!@#$%^&*(),.?"{}|<>]/,
            "Password must have at least one symbol"
        )
        .matches(
            /[0-9]/,
            "Password must contain at least one number"
        )
        .matches(
            /[A-Z]/,
            "Password must contain at least one uppercase letter"
        )
        .matches(
            /[a-z]/,
            'Password must contain at least one lowercase letter'
        ),
        confirmPassword: Yup.string().oneOf(
            [Yup.ref("password")],
            "password must match"
        
        ).required("Confirm password should not be empty")
    }) 

    const handleChange = (event) =>{
        setValues(prev=>{
            return {
                ...prev,
                [event.target.name]: event.target.value
            }
        })
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await validationSchema.validate(values, { abortEarly: false });
    
            // If validation passes, proceed with the request
            const res = await axios.post('http://localhost:5000/register', {name: values.name,email: values.email,password: values.password},{ withCredentials: true });
            
            if (res.data.Status === "Success") {
                navigate('/login');
            } else {
                alert(res.data.Error ? res.data.Error : "Error");
            }
        } catch (error) {
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
    };
    
    return(
        <div className='flex justify-center items-center bg-blue-500 min-h-screen'>
            <div className="bg-white p-6 rounded-lg w-1/4">
                <h2 className="text-teal-700 font-extrabold">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input 
                            type="text" 
                            value={values.name} 
                            onChange={handleChange} 
                            placeholder="Enter name" 
                            name="name" 
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        />
                        {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>} {/* if error exists it will show a paragraph with the error's description */}
                    </div>
    
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input 
                            type="email" 
                            value={values.email} 
                            onChange={handleChange} 
                            placeholder="Enter email" 
                            name="email" 
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        />
                        {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                    </div>
    
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input 
                            type="password" 
                            value={values.password} 
                            onChange={handleChange} 
                            placeholder="Enter password" 
                            name="password" 
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        />
                        {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                    </div>
    
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input 
                            type="password" 
                            value={values.confirmPassword} 
                            onChange={handleChange} 
                            placeholder="Confirm password" 
                            name="confirmPassword" 
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
                    </div>
                    
                    <button 
                        type="submit"  
                        className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                        Sign Up
                    </button>
                    
                    <Link 
                        to="/login" 
                        className="w-full py-2 mt-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md text-center block hover:bg-gray-200"
                    >
                        Go to Login
                    </Link>
                </form>
            </div>
        </div>
    )
    
}