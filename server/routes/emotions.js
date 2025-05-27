const express= require('express');
const router= express.Router();

const Emotion= require('../models/Emotion')
const jwt=require("jsonwebtoken");
const JWT_SECRET=process.env.JWT_SECRET;



// Middleware: vahvista käyttäjä tokenilla
const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Missing token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // userId ja email
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Hae käyttäjän tehtävät
router.get("/", authenticateUser, async (req, res) => {
  try {
    const Emotions = await Emotion.find({ userId: req.user.userId }).sort({timestamp:-1});
    res.json(Emotions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch Emotions" });
  }
});

// Luo uusi tehtävä
router.post("/", authenticateUser, async (req, res) => {
  try {
    const newEmotion = new Emotion({ ...req.body, userId: req.user.userId });
    console.log(req.body)
    await newEmotion.save();
    res.status(201).json(newEmotion);
  } catch (err) {
    res.status(500).json({ message: "Failed to save Emotion" });
  }
});


router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const deletedEmotion = await Emotion.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!deletedEmotion) return res.status(404).json({ message: "Diary not found" });

    res.json({ message: "Emotion deleted", Emotion: deletedEmotion });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete Emotion" });
  }
});



module.exports = router;
