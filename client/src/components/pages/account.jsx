import { FaUserCircle } from "react-icons/fa";
import "./account.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LogOut from "./logOut";

const Account = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token); // true jos token löytyy
  }, []);


  return (
    <div className="account-container">
      <FaUserCircle className="user-icon" />
      
       {loggedIn ? (
        <LogOut />
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
