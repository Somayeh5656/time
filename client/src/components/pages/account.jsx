import { FaUserCircle } from "react-icons/fa";
import "./account.css";
import { Link } from "react-router-dom";
import "./signIn"
import "./createAccount"

const Account = ()=>{
    return (
        <div className="account-container">
            <FaUserCircle className="user-icon"/>
            <Link to="/signIn" className="btn sign-in account-page">Sign In</Link>
            <Link to="/createAccount" className="btn create-account">Create Account</Link>

        </div>

    );
};

export default Account;