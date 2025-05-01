import "./signIn.css"
import { RiCalendarCheckFill } from "react-icons/ri";
import React, {useState} from "react";


const SignIn = ()=>{
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
            const response=await fetch("http://localhost:5000/api/auth",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify(formData),
            });
            const data=await response.json();

            if(response.ok){
                alert("Login successful")

            }else{
                alert(data.message|| "Login failed")

            }

        }catch(error){
            console.error("Login error:", error);
            alert("Something went wrong");

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
                <input name="password" value={formData.password} onChange={handleChange} type="password" placeholder="*************************"></input>

                <button type="submit" className="btn sign-btn signing-page">Sign In</button>

            </form>
        
        </>


    );
};

export default SignIn;