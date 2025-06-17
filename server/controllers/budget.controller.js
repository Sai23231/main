import mongoose, { isValidObjectId } from 'mongoose';
import Budget from '../models/Budget.model.js';

// Create a new budget
// admin side 
export const createBudget = async (req, res) => {
  try {
    const { eventName, totalBudget, categories, userId } = req.body;
    const newBudget = new Budget(
      { userId: new mongoose.Types.ObjectId(userId),
      eventName, 
      totalBudget, 
      categories }
    );
    await newBudget.save();
    res.status(201).json(newBudget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createUserBudget = async (req, res) => {
  try {
    const { eventName, totalBudget, categories} = req.body;
    const userId = req.id; // from token
    const newBudget = new Budget(
      { userId: new mongoose.Types.ObjectId(userId),
      eventName, 
      totalBudget, 
      categories }
    );
    await newBudget.save();
    res.status(201).json(newBudget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Get all budgets
export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find();
    res.status(200).json(budgets);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Get a single budget by ID
export const getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.status(200).json(budget);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserBudgets = async (req, res) => {
  try {
    const userId = req.id; // from token
    if (!(userId && isValidObjectId(userId))) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const budgets = await Budget.find({ userId: new mongoose.Types.ObjectId(userId) });
    if (budgets.length === 0) {
      return res.status(200).json({ message: 'No budgets found for this user' });
    }
    if (!budgets) {
      return res.status(404).json({ message: 'Budgets not found' });
    }
    res.status(200).json(budgets);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Update a budget
export const updateBudget = async (req, res) => {
  try {
    const { eventName, totalBudget, categories } = req.body;
    const updatedBudget = await Budget.findByIdAndUpdate(
      req.params.id,
      { eventName, totalBudget, categories },
      { new: true }
    );
    if (!updatedBudget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.status(200).json(updatedBudget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a budget
export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findByIdAndDelete(req.params.id);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.status(200).json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
