import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  assignedTo: { type: String, required: true },
  completed: {type: Boolean, default: false},  //before using new model manually delete all tasks from mongodb cluster 
  createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model("Task", taskSchema);
export default Task;
