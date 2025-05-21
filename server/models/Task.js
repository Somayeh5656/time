const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  userId: String,
  date: String, // "YYYY-MM-DD"
  title: String,
  start: Number, // minutes
  end: Number,   // minutes
  repeat: String, // "none", "daily", "weekly", "monthly"
});

module.exports = mongoose.model("Task", taskSchema);
