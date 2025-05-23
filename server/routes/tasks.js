const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
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
router.get("/", authenticateUser, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

// Luo uusi tehtävä
router.post("/", authenticateUser, async (req, res) => {
  try {
    const newTask = new Task({ ...req.body, userId: req.user.userId });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: "Failed to save task" });
  }
});

// Päivitä tehtävä (hae ID esim. otsikko+ajat)
router.put("/", authenticateUser, async (req, res) => {
  try {
    const { title, start, end, repeat, date } = req.body;

    const task = await Task.findOneAndUpdate(
      {
        userId: req.user.userId,
        title,
        start,
        end,
        repeat,
        date
      },
      req.body,
      { new: true }
    );

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to update task" });
  }
});

module.exports = router;
