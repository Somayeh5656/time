import { Link } from "react-router-dom";
import "./createAccount.css"
import React,{useState} from "react";



const CreateAccount = ()=>{
    const [formData, setFormData]=useState({
        username:"",
        email:"",
        password:"",
        repeatpassword:"",


    });

    const handleChange =(e)=>{
        const {name, value}= e.target;
        setFormData(prev=>({...prev, [name]:value}))

    }

    const handleSubmit = async(e)=>{
        e.preventDefault();

        if (formData.password != formData.repeatpassword){
            alert("Password do not match");
            return;
        }

        try{
            const response= await fetch("http://localhost:5000/api/users",{
                method:"POST",
                headers:{"content-Type": "application/json"},
                body: JSON.stringify(formData),
            });

            const data= await response.json();
            if (response.ok){
                alert("Account created!")

            }else{
                alert(data.message || "Something went wrong");
            }
            }catch(error){
                console.error("signup error", error)
            }

    }

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
                
                <p className="account-footer"> Already have an account? {" "}
                     <Link to="/signIn" className="link-signin">  Sign In</Link>

                </p>
            </form>

        </div>
        
    );
};

export default CreateAccount;