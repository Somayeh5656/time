const express = require("express");
const router = express.Router();
const Goal = require("../models/Goal");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

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
router.put("/:id", authenticateUser, async (req, res) => {
  try {
    const updatedGoal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );

    if (!updatedGoal) return res.status(404).json({ message: "Goal not found" });

    res.json(updatedGoal);
  } catch (err) {
    res.status(500).json({ message: "Failed to update Goal" });
  }
});


// Luo uusi tehtävä
// ✅ This will respond to POST /goals
router.post("/", authenticateUser, async (req, res) => {
  
  try {
    const newGoal = new Goal({
      ...req.body,
      userId: req.user.userId, // Ensure the goal is tied to the logged-in user
    });
    const savedGoal = await newGoal.save();
    res.status(200).json(savedGoal);
  } catch (err) {
    console.error("Failed to save goal:", err); // Helpful for debugging
    res.status(500).json({ message: "Failed to save goal", error: err });
  }
});



// Päivitä tehtävä (hae ID esim. otsikko+ajat)
router.get("/", authenticateUser, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.userId });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch goals" });
  }
});


router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const deletedGoal = await Goal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!deletedGoal) return res.status(404).json({ message: "Goal not found" });

    res.json({ message: "Goal deleted", Goal: deletedGoal });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete Goal" });
  }
});


module.exports = router;
