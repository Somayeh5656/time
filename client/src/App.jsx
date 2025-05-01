import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout';
import './App.css';
import Account from './components/pages/account';
import Calender from './components/pages/calender';
import Goals from './components/pages/goals';
import Health from './components/pages/health';
import House from './components/pages/house';
import Reminders from './components/pages/reminders';
import Routines from './components/pages/routines';
import StudyWork from './components/pages/studyWork';
import ToDo from './components/pages/todo';
import SignIn from './components/pages/signIn';
import CreateAccount from './components/pages/createAccount';





function App() {
  

  return (
    <>
      <Router>
        <Routes>
          
          <Route path="/" element={<Layout />}>
            <Route path="/account" element= {<Account />}></Route>
            <Route path="/calender" element= {<Calender />}></Route>
            <Route path="/goals" element= {<Goals />}></Route>
            <Route path="/health" element= {<Health />}></Route>
            <Route path="/house" element= {<House />}></Route>
            <Route path="/reminders" element= {<Reminders />}></Route>
            <Route path="/routines" element= {<Routines />}></Route>
            <Route path="/studyWork" element= {<StudyWork />}></Route>
            <Route path="/todo" element= {<ToDo/>}></Route>
            <Route path="/signIn" element={<SignIn />}></Route>
            <Route path="/createAccount" element={< CreateAccount/>}></Route>
            
          </Route>
          
        </Routes>
      </Router>
    
      
    </>
  )
}

export default App
