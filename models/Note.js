const mongoose = require("mongoose");

// Note schema
const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  noteText: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  timestamps: true,
});
module.exports = mongoose.model("Note", noteSchema);
