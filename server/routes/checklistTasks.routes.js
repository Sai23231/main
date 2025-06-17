import express from 'express';
import {
  getTasks,
  getUserTasks,
  createTask,
  createUserTask,
  updateTask,
  deleteTask,
  toggleTask,
  addNote,
  updateTaskOrder
} from '../controllers/checklist.controller.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/', getTasks);
router.get('/getUserTasks', verifyToken, getUserTasks);
router.post('/create', createTask);
router.post('/createUserTask', verifyToken, createUserTask);
router.put('/order', updateTaskOrder);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.put('/:id/toggle', toggleTask);
router.post('/:id/notes', addNote);

export default router;
