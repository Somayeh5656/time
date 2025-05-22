import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout';
import './App.css';
import Account from './components/pages/account';
import Health from './components/pages/health/health';
import House from './components/pages/house';
import Routines from './components/pages/routines/routines';
import Diary from './components/pages/diary';
import SignIn from './components/pages/signIn';
import Goals from './components/pages/goals';
import CreateAccount from './components/pages/createAccount';
import Feelings from './components/pages/health/feelings/feelings';




function App() {
  
  const[loggedIn,setLoggedIn]=useState(!!localStorage.getItem("token"))

  return (
    <>
      <Router>
        <Routes>
          
          <Route path="/" element={<Layout loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>}>
            <Route path="/account" element= {<Account loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}></Route>
            <Route path="/goals" element= {<Goals />}></Route>
            <Route path="/feelings" element= {<Feelings />}></Route>
            <Route path="/house" element= {<House />}></Route>          
            <Route path="/routines" element= {<Routines />}></Route>
            <Route path="/diary" element= {<Diary />}></Route>         
            <Route path="/signIn" element={<SignIn setLoggedIn={setLoggedIn} />}></Route>
            <Route path="/createAccount" element={< CreateAccount/>}></Route>
           
            
          </Route>
          
        </Routes>
      </Router>
    
      
    </>
  )
}

export default App
