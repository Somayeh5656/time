const mongoose=require("mongoose");

const emotionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  emotion: {
    type: String,
    required: true
  },
  feelings: {
    type: [String], // huomaa pieni alkukirjain ja array
    default: []
  },
  impacts: {
    type: [String],
    default: []
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports=mongoose.model("Emotion", emotionSchema)
