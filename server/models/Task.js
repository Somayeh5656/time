const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  start: { type: Number, required: true },
  end: { type: Number, required: true },
  repeat: { type: String }
});

module.exports = mongoose.model("Task", taskSchema);
