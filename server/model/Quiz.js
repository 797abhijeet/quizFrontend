import mongoose, { Schema } from "mongoose";
import Admin from "./Admin.js";
import User from "./User.js";

const quizSchema = mongoose.Schema({
  // id: {
  //     type: String,
  //     required: true
  // },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  attemptedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
});

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
