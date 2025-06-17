import mongoose from "mongoose";
import ChecklistTask from "../models/checklistTask.model.js";

// GET all tasks (sorted by order, then dueDate)
export const getTasks = async (req, res) => {
  try {
    const tasks = await ChecklistTask.find().sort({ order: 1, dueDate: 1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getUserTasks = async (req, res) => {
  try {
    const userId = req.id
    const tasks = await ChecklistTask.find({userId: new mongoose.Types.ObjectId(userId)}).sort({ order: 1, dueDate: 1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST create a new task
export const createTask = async (req, res) => {
  const { name, category, dueDate, priority, userId } = req.body;
  if (!name || !category || !dueDate) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const newTask = new ChecklistTask({
      userId: new mongoose.Types.ObjectId(userId),
      name,
      category,
      dueDate,
      priority,
      completed: false,
      order: Date.now() // simple order value; adjust as needed
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const createUserTask = async (req, res) => {
  const { name, category, dueDate, priority } = req.body;
  const userId = req.id; // from token
  if (!name || !category || !dueDate) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const newTask = new ChecklistTask({
      userId: new mongoose.Types.ObjectId(userId),
      name,
      category,
      dueDate,
      priority,
      completed: false,
      order: Date.now() // simple order value; adjust as needed
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT update a task (used for saving modal edits)
export const updateTask = async (req, res) => {
  try {
    const updatedTask = await ChecklistTask.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTask)
      return res.status(404).json({ message: "Task not found" });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE a task
export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await ChecklistTask.findByIdAndDelete(req.params.id);
    if (!deletedTask)
      return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT toggle task completed status
export const toggleTask = async (req, res) => {
  try {
    const task = await ChecklistTask.findById(req.params.id);
    if (!task)
      return res.status(404).json({ message: "Task not found" });
    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST add a note to a task
export const addNote = async (req, res) => {
  try {
    const { note } = req.body;
    const task = await ChecklistTask.findById(req.params.id);
    if (!task)
      return res.status(404).json({ message: "Task not found" });
    task.notes.push(note);
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT update tasks order after drag and drop
export const updateTaskOrder = async (req, res) => {
  try {
    const { tasks } = req.body; // expects an array of objects { id, order }
    for (const t of tasks) {
      await ChecklistTask.findByIdAndUpdate(t.id, { order: t.order });
    }
    res.json({ message: "Order updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
