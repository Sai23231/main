import mongoose from "mongoose";
import Task from "../models/task.model.js";
import TeamMember from "../models/teamMember.model.js";
import { io } from "../server.js";

export const getTasks = async (_, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserTasks = async (req, res) => {
  try {
    const userId = req.id;
    const tasks = await Task.find({ userId : new mongoose.Types.ObjectId(userId) });
    if (!tasks || tasks.length === 0) {
      return res.status(200).json([]);
    }
    res.json(tasks);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const createUserTask = async (req, res) => {
  const { title, description, assignedTo } = req.body;
  const userId = req.id; // from token
  if (!title || !description || !assignedTo) {
    return res.status(400).json({ message: "Please provide all required fields." });
  }
  try {
    const newTask = new Task({ 
      userId: new mongoose.Types.ObjectId(userId), 
      title, description, assignedTo });
    await newTask.save();
    io.emit("taskAdded", newTask); // Emit event to all connected clients
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const createTask = async (req, res) => {
  const { title, description, assignedTo, userId } = req.body;

  if (!title || !description || !assignedTo) {
    return res.status(400).json({ message: "Please provide all required fields." });
  }

  try {
    const newTask = new Task({ 
      userId: new mongoose.Types.ObjectId(userId), 
      title, description, assignedTo });
    await newTask.save();
    io.emit("taskAdded", newTask); // Emit event to all connected clients
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const completeTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const updatedTask = await Task.findByIdAndUpdate(taskId, { 
      $set:{
        completed: true 
      },
    }, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    io.emit("taskUpdated", updatedTask);
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, description, assignedTo } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $set: { title, description, assignedTo } },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    io.emit("taskUpdated", updatedTask); // Notify all clients
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    io.emit("taskDeleted", taskId); // Notify all clients
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeamMembers = async (_, res) => {
  try {
    const members = await TeamMember.find();
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserTeamMembers = async (req, res) => {
  try {
    const userId = req.id; // from token
    const members = await TeamMember.find({ userId: new mongoose.Types.ObjectId(userId) });
    if (!members || members.length === 0) {
      return res.status(200).json([]);
    }
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addTeamMember = async (req, res) => {
  const { name, userId } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Member name is required." });
  }

  try {
    const newMember = new TeamMember({ userId: new mongoose.Types.ObjectId(userId), name});
    await newMember.save();
    io.emit("memberAdded", newMember); // Emit event to all connected clients
    res.status(201).json(newMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addUserTeamMember = async (req, res) => {
  const { name } = req.body;
  const userId = req.id; // from token

  if (!name) {
    return res.status(400).json({ message: "Member name is required." });
  }

  try {
    const newMember = new TeamMember({ userId: new mongoose.Types.ObjectId(userId), name });
    await newMember.save();
    io.emit("memberAdded", newMember); // Emit event to all connected clients
    res.status(201).json(newMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
