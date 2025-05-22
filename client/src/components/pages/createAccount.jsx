import { Link } from "react-router-dom";
import "./createAccount.css"
import React,{useState} from "react";
import axios from "../../utils/axios"
import { useNavigate } from "react-router-dom";



const CreateAccount = ()=>{
    const [formData, setFormData]=useState({
        username:"",
        email:"",
        password:"",
        repeatpassword:"",


    });

    
    const [error, setError]=useState("");
    const navigate= useNavigate();

    const handleChange =(e)=>{
        const {name, value}= e.target;
        setFormData(prev=>({...prev, [name]:value}))

    }


    const handleSubmit = async(e)=>{
        e.preventDefault();

        if(formData.password !== formData.repeatpassword){
            setError("Password do not match");
            return;
        }// if (formData.password.length<6){
            //setError("Password must be at least 6 characters");
            //return;
        //}

        try{
            const {username, email, password}= formData;
            const response= await axios.post('/createAccount',{username, email, password});
            console.log("Login response:", response.data)
            alert("Account created!");
            navigate ("/signIn")
            }catch(error){
                console.error("signup error", error)
                setError(error.response?.data?.message||"Something went wrong")
            }
    };



    return(


        <div className="create-account-container">

            <h1>Create Account</h1>
            <form className="account-form" onSubmit={handleSubmit}>
                <label>Username</label>
                <input name="username" value={formData.username} onChange={handleChange} type="text" placeholder="user_name" required />
                <label>Email</label>
                <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="example@gmail.com" required />
                <label>Password</label>
                <input name="password" value={formData.password} onChange={handleChange} type="password" placeholder="********" required />
                <label >Repeat Password</label>
                <input name="repeatpassword" value={formData.repeatpassword} onChange={handleChange} type="password" placeholder="********" required />

                <button type="submit" className="btn create-btn">Sign Up</button>
                 {error && <p className="error-message"> {error}</p>}

                
                <p className="account-footer"> Already have an account? {" "}
                     <Link to="/signIn" className="link-signin">  Sign In</Link>
                </p>

                
            </form>

        </div>
        
    );
};

export default CreateAccount;