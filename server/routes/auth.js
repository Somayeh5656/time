const express= require('express');
const router= express.Router();
const User= require('../models/User')

router.post('/',async (req, res)=>{
const {email, password} =req.body;
try{
    const user= await User.findOne({email});
    if(!user) return res.status(404).json({message:"User not found"})
    if (user.password !== password){
        return res.status(401).json({message:"Incorrect password"});
    }
    res.status(200).json({message:"Login successful",user})
}catch(err){
    res.status(500).json({message:"Login error"})

}

});

module.exports =router;