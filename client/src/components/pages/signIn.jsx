import "./signIn.css"
import { RiCalendarCheckFill } from "react-icons/ri";
import React, {useState} from "react";
import axios from "../../utils/axios"
import { useNavigate } from "react-router-dom";



const SignIn = ()=>{
    const navigate= useNavigate();
    const [formData, setFormData]=useState({
        email:"",
        password:""
    });


    const handleChange= (e)=>{
        const {name,value} = e.target;
        setFormData(prev=>({...prev, [name]:value }));

    }

    const handleSubmit= async (e)=>{
        e.preventDefault();

        try{
            const response=await axios.post("/signIn", formData);
            console.log("Login response:", response.data)
            localStorage.setItem("token", response.data.token);

                alert("Login successful")
                navigate("/");

        }catch(error){
            console.error("Login error:", error);
            console.log("Full error response: ",error.response)
            alert(error.response?.data?.message||"something went wrong");

        }

    };
    


    return (
        <>            
            <form className="sign-in-container" onSubmit={handleSubmit}>
            <div className="task-icon"><RiCalendarCheckFill /> </div>
                
                <h1>SignIn</h1>
                <label>Email</label>
                <input name="email" value={formData.email} onChange={handleChange} type="text" placeholder="example@gmail.com" required ></input>

                <label>Password</label>
                <input name="password" value={formData.password} onChange={handleChange} type="password" placeholder="****************" required></input>

                <button type="submit" className="btn sign-btn signing-page">Sign In</button>

            </form>
        </>


    );
};

export default SignIn;