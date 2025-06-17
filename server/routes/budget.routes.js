import express from 'express';
import {
  createBudget,
  createUserBudget,
  getBudgets,
  getBudgetById,
  getUserBudgets,
  updateBudget,
  deleteBudget,
} from '../controllers/budget.controller.js';
import verifyToken from '../middleware/verifyToken.js'; 

const router = express.Router();

// Create a new budget
router.post('/createBudget', createBudget);

router.post('/createUserBudget', verifyToken, createUserBudget);
router.get('/getUserBudgets', verifyToken, getUserBudgets);

// Get all budgets
router.get('/', getBudgets);

// Get a single budget by ID
router.get('/:id', getBudgetById);

// Update a budget
router.put('/:id', updateBudget);

// Delete a budget
router.delete('/:id', deleteBudget);

export default router;