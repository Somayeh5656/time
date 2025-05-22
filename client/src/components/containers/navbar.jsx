import React, { useState, useEffect, useRef } from "react";
import { HiMenu, HiSearch, HiUser, HiX } from 'react-icons/hi';
import "./navbar.css";
import { Link } from "react-router-dom";
import LogOut from "../pages/logOut";

const Navbar = ({loggedIn,setLoggedIn}) => {
  const [menuOpen, setMenuOpen] = useState(false);
   

   useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout=()=>{
    localStorage.removeItem("token");
    setLoggedIn(false);
  }


  return (
    <>
      <header className="app-header">

        <div className="left-icons">
          <i className="menu-icon" onClick={toggleMenu}><HiMenu /></i>
          <i className="search-icon"><HiSearch /></i>
        </div>

        <div className="logo-text">
          <span className="logo-uppercase">T</span>ime Management
        </div>
      

        {/* Desktop-valikko näkyy vain isolla ruudulla */}
        <nav className="desktop-menu">
          <ul>
            <li><Link to="/routines" onClick={()=> setMenuOpen(false)}>Routines</Link></li>
            <li><Link to="/goals"  onClick={()=> setMenuOpen(false)}>Goals</Link></li>
            <li><Link to="/diary" onClick={()=> setMenuOpen(false)}>Diary</Link></li>
           
            <li><Link to="/feelings" onClick={()=> setMenuOpen(false)}>Mood Tracker</Link></li>
          </ul>
        </nav>

        <div className="right-icon">
        {loggedIn ? (
          <span className="logout-btn" onClick={()=>{handleLogout()}} >Sign Out</span>
        ) : (
          <Link to="/account">
            <HiUser />
          </Link>
        )}
      </div>


      </header>



      {/* Mobiilivalikko näkyy pienenä ja toggle toimii */}
      <nav className={`mobile-menu ${menuOpen ? "active" : ""}`}>
        <div className="mobile-menu-header">
          <span className="menu-title">Menu</span>
          <i className="close-icon" onClick={() => setMenuOpen(false)}><HiX /></i>
        </div>
        <ul>
            <li><Link to="/routines" onClick={()=> setMenuOpen(false)}>Routines</Link></li>
            <li><Link to="/goals" onClick={()=> setMenuOpen(false)}>Goals </Link></li>
             <li><Link to="/diary" onClick={()=> setMenuOpen(false)}>Diary</Link></li>

            <li><Link to="/feelings" onClick={()=> setMenuOpen(false)}>Mood Tracker</Link></li>
            {loggedIn ? (
           <li><span className="logout-btn" onClick={()=>{handleLogout();toggleMenu();}}>Sign Out</span></li>
        ) : (
          <li><Link to="/account" onClick={() => setMenuOpen(false)}>Account</Link></li>
          )}

           


          </ul>
      </nav>




    </>
  );
};

export default Navbar;