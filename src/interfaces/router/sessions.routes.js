import express from "express";
import checkAuth from '../middleware/authMiddleware.js';
import checkRole from '../middleware/roleMiddleware.js';
import {
  getAllSessions,
  getSessionDetail,
  createSession,
} from "../controller/sessionController.js"

const router = express.Router();

router.get("/detail/:id", checkAuth, getSessionDetail);

router.post("/create/:idcurso", checkAuth, checkRole([2]), createSession);
router.post("/list/:id", checkAuth, getAllSessions);

export default router;
