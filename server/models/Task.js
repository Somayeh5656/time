const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  start: { type: Number, required: true },
  end: { type: Number, required: true },
  repeat: { type: String, enum: ["", "daily", "weekly", "monthly"], default: "" },
  date: { type: String, required: true } // e.g., "2025-05-22"
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
