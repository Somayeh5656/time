import "./signIn.css"
import { RiCalendarCheckFill } from "react-icons/ri";



const SignIn = ()=>{
    return (
        <>
            
            <div className="sign-in-container">
            <div className="task-icon"><RiCalendarCheckFill /> </div>
                
                <h1>SignIn</h1>
                <label>Email</label>
                <input type="text" placeholder="example@gmail.com"></input>
                <label>Password</label>
                <input type="password" placeholder="*************************"></input>

                <button type="submit" className="btn sign-btn signing-page">Sign In</button>

            </div>
        
        </>


    );
};

export default SignIn;