import { Link,useNavigate, } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import * as Yup from 'yup';

export default function Login(){
    const navigate=useNavigate();
    const [values,setValues] = useState({
        email: '',
        password: ''
    })
    const [errors,setErrors] = useState({});
    axios.defaults.withCredentials = true;
    const validationSchema = Yup.object({
        email: Yup.string().required('Email is required').email("Invalid Email"),
        password: Yup.string().required('Password is required')
    })

    const handleChange = (event) =>{
        setValues(prev=>{
            return {
                ...prev,
                [event.target.name]: event.target.value
            }
        })
    }
    const handleSubmit =  async (event)=>{
        event.preventDefault();
        const newErrors={};
        try{
            await validationSchema.validate(values,{abortEarly: false})
           
           const res = await axios.post('http://localhost:5000/login',values); // server is listening on its own port (5000, not same as front-end port)
            console.log(res);
                if(res.data.Status==="Success"){
                    console.log("Success");
                    navigate('/');
                }
                else {
                    console.log(res.data.Error);
                    newErrors.final=res.data.Error;
                }
            }
            catch(error){
                if(error.inner){
                    error.inner.forEach(err=>{
                        newErrors[err.path]=err.message
                    })
                } // meaning coming from yup
                else console.log(error+"not inner from Yup");
            }
            setErrors(newErrors);

       
    }
    return(
        <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
            <div className="bg-white p-3 rounded w-25">
                <h2>Sign-In</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email">Email</label>
                        <input  type="email" value={values.email} onChange={handleChange} placeholder="enter email" name="email" className="form-control rounded-0" />
                        {errors.email && <p className="text-danger">{errors.email}</p>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password">Password</label>
                        <input  type="password" value={values.password} onChange={handleChange} placeholder="enter password" name="password" className="form-control rounded-0" />
                        {errors.password && <p className="text-danger">{errors.password}</p>}

                    </div>
                    {errors.final && <p className="text-danger">{errors.final}</p>}
                    <button type="submit" className="btn btn-success w-100 rounded-0">Log In</button>
                    <Link to="/register" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">Go to Register</Link>
                </form>
            </div>
        </div>
    )
}