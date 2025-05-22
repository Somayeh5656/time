const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  userId: {type:mongoose.Schema.Types.ObjectId,ref:"User", required:true},
  date: String, // "YYYY-MM-DD"
  title: String,
  start: Number, // minutes
  end: Number,   // minutes
  repeat: String, // "none", "daily", "weekly", "monthly"
  date:String,
});

module.exports = mongoose.model("Task", taskSchema);
