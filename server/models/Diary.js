const mongoose = require("mongoose");

const DiarySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  date: { type: String, required: true },
});

module.exports = mongoose.model("Diary", DiarySchema);
