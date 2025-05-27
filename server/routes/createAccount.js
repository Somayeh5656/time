const express = require('express');
const router = express.Router();
const User= require('../models/User');
const mongoose = require('mongoose');
const bcrypt= require('bcryptjs')


router.post('/', async(req,res)=>{
    const{username, email, password}= req.body;

    try{

        if (!username|| !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }

        const existingUser= await User.findOne({email});
        if (existingUser){
            console.log("user already exist")
            return res.status(400).json({message:"User already exists"})
        };

        const hashedPassword= await bcrypt.hash(password,10);
        const user=new User({username, email, password: hashedPassword});
        await user.save();
        res.status(201).json({message:"User created!"})

    }catch(err){
        console.error("Virhe käyttäjää luodessa:", err);
        res.status(500).json({message:"Error creating user"})

    }
        
})

router.get('/', async (req, res) => {
  console.log("GET /api/createAccount vastaanotettu");
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports =router;