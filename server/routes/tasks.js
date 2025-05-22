const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const signIn = require('../middleware/signIn');

// POST – uusi tehtävä
router.post('/', signIn, async (req, res) => {
  const { title, start, end, repeat, date } = req.body;

  try {
    const task = new Task({
      userId: req.user.userId,
      title,
      start,
      end,
      repeat,
      date
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Virhe tallennettaessa tehtävää' });
  }
});

router.get('/', signIn, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Virhe haettaessa tehtäviä' });
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
