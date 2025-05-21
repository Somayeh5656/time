const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// POST – uusi tehtävä
router.post("/", async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT – muokkaa olemassa olevaa (voit tehdä myös tarkemman logiikan)
router.put("/", async (req, res) => {
  try {
    const { userId, date, title, start, end, repeat } = req.body;
    const task = await Task.findOneAndUpdate(
      { userId, date, title, start, end },
      { repeat },
      { new: true, upsert: true }
    );
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
