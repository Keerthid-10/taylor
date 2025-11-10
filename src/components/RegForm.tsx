import axios from "axios";
import React, { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface form {
    userName:string,
    password:string,
    confirmPassword:string,
    phoneNumber:string,
    email:string,
    continent:string
}
interface err {
    userName:string,
    password:string,
    confirmPassword:string,
    phoneNumber:string,
    email:string,
    continent:string
}
interface valid {
    userName:boolean,
    password:boolean,
    confirmPassword:boolean,
    phoneNumber:boolean,
    email:boolean,
    continent:boolean
}
const RegForm : React.FC = () => {
    const [formData,setFormData] = useState<form>({
        userName:"",
        password:"",
        confirmPassword:"",
        phoneNumber:"",
        email:"",
        continent:""
    });
    const [error,setError] = useState<err>({
        userName:"",
        password:"",
        confirmPassword:"",
        phoneNumber:"",
        email:"",
        continent:""
    });
    const [errorMsg,setErrorMsg] = useState<string>("");
    const [validF,setvalidF] = useState<valid>({
        userName:false,
        password:false,
        confirmPassword:false,
        phoneNumber:false,
        email:false,
        continent:false
    })
    const [success,setSuccess] = useState<string>("");

    const continents = ["Asia", "Europe", "Africa", "North America", "South America"];

    const navigate = useNavigate();

    const handleChange = (e:ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>{
        const {name, value} = e.target;
        setFormData({...formData,[name]:value});
        validate(name,value);
    }
    const validate = (fieldName:string,fieldValue:string)=>{
       
        switch(fieldName){
            case "userName":{
                const regex = /^[A-Z][a-z]{3,}$/;
                if(!fieldValue){
                    setError({...error,[fieldName]:"Name Required"});
                    setvalidF({...validF,[fieldName]:false})
                }
                else if(!(regex.test(fieldValue))){
                    setError({...error,[fieldName]:"Name must be atleast 3 characters and start with capitl letter"});
                    setvalidF({...validF,[fieldName]:false})
                }
                else{
                    setError({...error,[fieldName]:""});
                    setvalidF({...validF,[fieldName]:true})
                }
                break;
            }
            case "password":{
                 if(!fieldValue){
                    setError({...error,[fieldName]:"Password Required"});
                    setvalidF({...validF,[fieldName]:false})
                }
                else if(!(fieldValue.length>=8 && fieldValue.length<=12)){
                    setError({...error,[fieldName]:"Password length should be correct"});
                    setvalidF({...validF,[fieldName]:false})
                }
                else{
                    setError({...error,[fieldName]:""});
                    setvalidF({...validF,[fieldName]:true})
                }
                break;
            }
            case "confirmPassword":{
                if(!fieldValue){
                    setError({...error,[fieldName]:"CF Required"});
                    setvalidF({...validF,[fieldName]:false})
                }
                else if(formData.password !== fieldValue){
                    setError({...error,[fieldName]:"Should match password"});
                    setvalidF({...validF,[fieldName]:false})
                }
                else{
                    setError({...error,[fieldName]:""});
                    setvalidF({...validF,[fieldName]:true})
                }
                break;
            }
            case "phoneNumber":{
                const regex = /^\d{10}$/;
                if(!fieldValue){
                    setError({...error,[fieldName]:"CF Required"});
                    setvalidF({...validF,[fieldName]:false})
                }
                else if(!(regex.test(fieldValue))){
                    setError({...error,[fieldName]:"enter valid number"});
                    setvalidF({...validF,[fieldName]:false})
                }
                else{
                    setError({...error,[fieldName]:""});
                    setvalidF({...validF,[fieldName]:true})
                }
                break;
            }
            case "email":{
                const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
                if(!fieldValue){
                    setError({...error,[fieldName]:"email Required"});
                    setvalidF({...validF,[fieldName]:false})
                }
                else if(!(regex.test(fieldValue))){
                    setError({...error,[fieldName]:"enter valid email"});
                    setvalidF({...validF,[fieldName]:false})
                }
                else{
                    setError({...error,[fieldName]:""});
                    setvalidF({...validF,[fieldName]:true})
                }
                break;
            }
            case "continent":{
                if(!fieldValue){
                    setError({...error,[fieldName]:"continent Required"});
                    setvalidF({...validF,[fieldName]:false})
                }else{
                    setError({...error,[fieldName]:""});
                    setvalidF({...validF,[fieldName]:true})
                }
                break;
            }
            default:
                break;
        }
    }
    const handleSubmit = async (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try{
            let data =  await axios.post<form[]>("http://localhost:3001/users",formData)
            console.log(data,"esdfg");
            setSuccess("data saved successfully")
        }catch(err){
            setErrorMsg("error in saving data")
        }
       
        
    }






    return(
        <div className="container-fluid" style={{justifyContent:"center"}}>
            <h1>Register</h1>
            <form  onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label" htmlFor="userName">userName</label>
                    <input
                    type="text"
                    className="form-control"
                    placeholder="Enter name"
                    name="userName"
                    id="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    />
                    {error.userName  && <span className="text-danger">{error.userName}</span>}
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="password">password</label>
                    <input
                    type="password"
                    className="form-control"
                    placeholder="Enter name"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    />
                    {error.password  && <span className="text-danger">{error.password}</span>}
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="confirmPassword">confirmPassword</label>
                    <input
                    type="password"
                    className="form-control"
                    placeholder="Enter name"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    />
                    {error.confirmPassword  && <span className="text-danger">{error.confirmPassword}</span>}
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="phoneNumber">phoneNumber</label>
                    <input
                    type="text"
                    className="form-control"
                    placeholder="Enter name"
                    name="phoneNumber"
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    />
                    {error.phoneNumber  && <span className="text-danger">{error.phoneNumber}</span>}
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="email">email</label>
                    <input
                    type="text"
                    className="form-control"
                    placeholder="Enter name"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    />
                    {error.email  && <span className="text-danger">{error.email}</span>}
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="continent">Continent</label>
                    <select
                        className="form-control"
                        name="continent"
                        value={formData.continent}
                        onChange={handleChange}
                        id="continent">
                            <option>Select continent</option>
                                {continents.map((e,index)=>{
                                return(
                                    <option key={index} value={e}>{e}</option>
                                )
                            })}
                        </select>
                        {error.continent && <span className="text-danger">{error.continent}</span>}
                </div>
                <div className="form-group text-center">
                <button 
                className="btn btn-primary"
                type="submit"
                name="button" onClick={()=>{navigate("/login")}}>Sumbit </button>
                {success && <span className="text-success">{success}</span>}
                {errorMsg && <span className="text-danger">{errorMsg}</span>}
                </div>
            </form>
        </div>
    )
}

export default RegForm;