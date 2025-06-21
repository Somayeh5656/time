const express=require("express");
const router= express.Router();
const Diary= require("../models/Diary");
const jwt=require("jsonwebtoken");
const JWT_SECRET= process.env.JWT_SECRET;

const authenticateUser=(req, res, next)=>{
  const authHeader= req.headers.authorization;
  if(!authHeader) return res.status(401).json({message:"Missing token"})

    const token=authHeader.split(" ")[1];

    try{
      const decoded=jwt.verify(token,JWT_SECRET);
      req.user=decoded;
      next();

    }catch(e){
      res.status(401).json({message:"Invalid token"})

    }

}

router.get("/",authenticateUser, async(req,res)=>{
  try{
    const Diaries=await Diary.find({userID: req.user.userId})
    res.json(Diaries);

  }catch(e){
    res.status(500).json({message:"Failed to fetch Diaries"})

  }

})

// Luo uusi tehtävä
router.post("/", authenticateUser, async (req, res) => {
  try {
    const newDiary = new Diary({ ...req.body, userId: req.user.userId });
    console.log(req.body)
    await newDiary.save();
    res.status(201).json(newDiary);
  } catch (err) {
    res.status(500).json({ message: "Failed to save Diary" });
  }
});

// Päivitä tehtävä (hae ID esim. otsikko+ajat)
router.put(":id",authenticateUser,async(req,res)=>{
  try{
    const updatedDiaries= await Diary.findOneAndUpdate(
      {
        _id : req.params.id,
        userId: req.user.userId
      },
      req.body,
      {new: true}
    );
    console.log(req.body);

    if(!updatedDiaries) return res.status(404).json({messge:"Diary not found"})
      res.json(updatedDiaries);


  }catch(e){
    res.status(500).json({message:"Failed to update Diary"})

  }
})

router.delete("/:id", authenticateUser, async(req,res)=>{
  try{
    const deletedDiary= await Diary.findOneAndDelete({
      _id: req.params.id,
      userId: req-user.userId
    });

    if(!deletedDiary) return res.status(404).json({message:"Diary not found"});

    res.json({message:"Diary deleted", Diary :deletedDiary})


  }catch(e){
    res.status(500).json({message:"Failed to delete Diary"})

  }

})


module.exports = router;
