import express from "express";
import { getTasks, getUserTasks, createTask, createUserTask, completeTask, updateTask, deleteTask } from "../controllers/task.controller.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getTasks);
router.get("/getUserTasks", verifyToken, getUserTasks);
router.post("/create", createTask);
router.post("/createUserTask", verifyToken, createUserTask);
router.put("/complete/:taskId",completeTask)
router.put("/update/:taskId",updateTask)
router.delete("/delete/:taskId",deleteTask)



export default router;