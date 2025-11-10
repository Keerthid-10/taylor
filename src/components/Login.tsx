import React, { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface form{
    email:string,
    password:string
}

interface User {
    
    userName: string;
    password: string;
    confirmPassword:string,
    phoneNumber: string;
    email: string;
    continent: string
}
const Login : React.FC = () =>{
    const [FormData,setFormData] = useState<form>({
        email:"",
        password:""
    })
    const navigate = useNavigate();
   const [errMsg,setErrMsg] = useState<string>("");
   const[loading,setLoading] = useState<boolean>(false);
    const [err,setErr] = useState<string>("");
    const handleChange = (e:ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>{
        const {name,value} = e.target;
        setFormData({...FormData,[name]:value})
    }
    const handleSubmit = async(e:FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if(!FormData.email || !FormData.password){
            setErr("Please enter both email and password");
            setLoading(false);
        }else{
            setErr("");
            setLoading(true);
        }
        try{
            const fetch = await axios.get<User[]>("http://localhost:3001/users")
            const user = fetch.data;
            const validuser =  user.find(e=>e.email === FormData.email)
            if(!validuser){
                setErr("User not found. Please check your email.")
                setLoading(false);
            }
            if(FormData.password !== validuser?.password){
                    setErr("Invalid password. Please try again.")
                    setLoading(false);
            }
            const userdetails = {
                userName : validuser?.userName,
                password : validuser?.password,
                confirmPassword:validuser?.confirmPassword,
                phoneNumber: validuser?.phoneNumber,
                email: validuser?.email,
                continent: validuser?.continent

            }
            sessionStorage.setItem("user",JSON.stringify(userdetails))
            sessionStorage.setItem("isAuthenticated","true")
        }catch(err){
            setErrMsg("An error occurred during login. Please try again.")
            setLoading(false);
        }

    }
    return(
        
        <div className="container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                    type="email"
                    className="form-control"
                    name="email"
                    id="email"
                    value={FormData.email}
                    onChange={handleChange} />
                </div>
                 <div className="form-group">
                    <label htmlFor="password" className="form-label">password</label>
                    <input
                    type="password"
                    className="form-control"
                    name="password"
                    id="password"
                    value={FormData.password}
                    onChange={handleChange} />
                </div>
                {err && <span className="text-danger">{err}</span>}
                <button 
                className="btn btn-primary"
                name="submit"
                type="submit"
                disabled={loading}
                onClick={()=>navigate("/home")}
                >Submit</button>
            </form>
        </div>
    )
}
export default Login;

