const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: {
  type: String,
  enum: ['Family', 'Health', 'Financial', 'Social', 'Education', 'Career', 'Character'],
  required: true
},
  term: { type: String, enum: ['Short Term', 'Medium Term', 'Long Term'], default: null },
  goal: { type: String },        // text goal
  steps: [
    {
      id: { type: String },
      text: { type: String, default: '' }
    }
  ],
  completed: { type: Boolean, default: false },

});


module.exports = mongoose.model("Goal", goalSchema);