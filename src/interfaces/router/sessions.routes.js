import express from "express";
import checkAuth from '../middleware/authMiddleware.js';
import checkRole from '../middleware/roleMiddleware.js';
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

router.post("/create", checkAuth, checkRole([2]), createSession);

router.patch("/update/:id", checkAuth, checkRole([2]), updateSession);

router.put("/status/:id", checkAuth, checkRole([2]), changeStatusSession);

export default router;
