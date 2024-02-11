import { Router } from "express";
import {
  createBoard,
  deleteBoard,
  getBoard,
  getBoards,
  updateBoard,
} from "../handlers/boards.js";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../handlers/tasks.js";

const router = Router();

// BOARDS
router.post("/boards", createBoard);
router.get("/boards/:id", getBoard);
router.get("/boards", getBoards);
router.put("/boards/:id", updateBoard);
router.delete("/boards/:id", deleteBoard);

// TASKS

router.post("/tasks", createTask);
router.get("/tasks/:boardID", getTasks);
router.put("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);
export default router;
