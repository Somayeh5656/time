const express=require("express");
const router=express.Router();

const Emotion=require("../models/Emotion")
const jwt=require("jsonwebtoken")
const JWT_SECRET=process.env.JWT_SECRET;

const authenticateUser=(req,res,next)=>{
    const authHeader=req.headers.authorization;
    if(!authHeader) return res.status(401).json({message :"token missing"});
    const token=authHeader.split(" ")[1];

    try{
        const decoded=jwt.verify(token,JWT_SECRET);
        req.user=decoded;
        next()

    }catch(e){
        res.status(401).json({messae:"Invalid token"});
    };

}

router.get("/",authenticateUser,async(req,res)=>{
    try{
        const Emotions=await Emotion.find({userId:req.user.userId}).sort({timestamp:-1});
        res.json(Emotions);

    }catch{
        res.status(500).json({message:"Failed to fetch Emotions"})
    }


});


router.post("/", authenticateUser, async(req,res)=>{
    try{
        const newEmotion= new Emotion({...req.body, userId: req.user.userId});
        await newEmotion.save();
        res.status(201).json(newEmotion)

    }catch{
        res.status(500).json({message:"Failed to save Emotion"})
    }
});

router.delete("/:id", authenticateUser, async(req,res)=>{

    try{
        const deletedEmotion=await Emotion.findOneAndDelete({
        _id:req.params.id,
        userId:req.user.userId
        });

        if (!deletedEmotion) return res.status(404).json({message:"Emotion not found"})
        
        res.json({message:"Emotion deleted", Emotion:deletedEmotion})
        }catch(e){
            res.status(500).json({message:"Failed to delete Emotion"})

        }
})

module.exports=router;