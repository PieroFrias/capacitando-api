import express from "express";
import checkAuth from '../middleware/authMiddleware.js';
import checkRole from '../middleware/roleMiddleware.js';
import { validateCreate, validateEdit } from "../middleware/validators/sessionValidator.js";
import {
  getAllSessions,
  getSessionDetail,
  createSession,
  updateSession,
  changeStatusSession,
} from "../controller/sessionController.js"

const router = express.Router();

router.get("/list/:id", checkAuth, getAllSessions);
router.get("/detail/:id", checkAuth, getSessionDetail);

router.post("/create", checkAuth, checkRole([2]), validateCreate, createSession);

router.patch("/update/:id", checkAuth, checkRole([2]), validateEdit, updateSession);

router.put("/status/:id", checkAuth, checkRole([2]), changeStatusSession);

export default router;
