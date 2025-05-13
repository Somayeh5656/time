const express = require('express');
const router = express.Router();
const User= require('../models/User');
const mongoose = require('mongoose');
const bcrypt= require('bcryptjs');
const jwt= require('jsonwebtoken');



const JWT_SECRET= process.env.JWT_SECRET;


router.post('/',async (req, res)=>{
const {email, password} =req.body;

try{
    const user= await User.findOne({email});
    if(!user) return res.status(404).json({message:"User not found"});

    const isMatch= await bcrypt.compare( password, user.password);
    if (!isMatch){
        return res.status(401).json({message:"Incorrect password"});
    }

    const token= jwt.sign(
        {userId: user._id, email:user.email},
        JWT_SECRET,
        {expiresIn: '1h'}
    );

    res.status(200).json({
        message:"Login successful",
        token, 
        user: {
            id: user._id, 
            username: user.username, 
            email: user.email}});




}catch(err){
    console.error("Login error:" ,err);
    res.status(500).json({message:"Login error"});

}

});

module.exports =router;