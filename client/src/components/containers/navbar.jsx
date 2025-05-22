import React, { useState, useEffect, useRef } from "react";
import { HiMenu, HiSearch, HiUser, HiX } from 'react-icons/hi';
import "./navbar.css";
import { Link } from "react-router-dom";
import LogOut from "../pages/logOut";

const Navbar = ({}) => {
  const [menuOpen, setMenuOpen] = useState(false);
   const [loggedIn, setLoggedIn] = useState(false);

   useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };


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
          <LogOut className="logout-btn" children="Sign Out" />
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
           <li><LogOut className="logout-btn" children="Sign Out" /></li>
        ) : (
          <li><Link to="/account" onClick={() => setMenuOpen(false)}>Account</Link></li>
          )}

           


          </ul>
      </nav>




    </>
  );
};

export default Navbar;