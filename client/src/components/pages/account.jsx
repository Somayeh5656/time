import { FaUserCircle } from "react-icons/fa";
import "./account.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


const Account = ({loggedIn, setLoggedIn}) => {
  const navigate = useNavigate();
  const handleLogout=()=>{
    localStorage.removeItem("token");
    setLoggedIn(false);
    navigate("/signIn")
  }

  return (
    <div className="account-container">
      <FaUserCircle className="user-icon" />
      
       {loggedIn ? (
        <span onclick={handleLogout} className="btn logout"> Sign Out </span>
      ) : (
        <>
          <Link to="/signIn" className="btn sign-in account-page">Sign In</Link>
          <Link to="/createAccount" className="btn create-account">Create Account</Link>
        </>
      )}
    </div>
  );
};

export default Account;
