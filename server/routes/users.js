const express = require('express');
const router = express.Router();
const User= require('../models/User');

router.post('/', async(req,res)=>{
    const{username, email, password}= req.body;
    console.log("Request body:", req.body);
    try{
        const user=new User({username,email,password})
        await user.save();
        res.status(201).json({message:"User created!"})
    }catch(err){
        console.error(err);
        console.error("Virhe käyttäjää luodessa:", err);
        res.status(500).json({message:"Error creating user"})

    }
        
})


module.exports =router;