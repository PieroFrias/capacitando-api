import express from "express";
import checkAuth from '../middleware/authMiddleware.js';
import checkRole from '../middleware/roleMiddleware.js';
import { validateCreate, validateEdit } from "../middleware/validators/contentValidator.js";
import {
  getAllContents,
  getContentDetail,
  createContent,
  updateContent,
  changeStatusContent,
} from "../controller/contentController.js"

const router = express.Router();

router.get("/list/:id", checkAuth, getAllContents);
router.get("/detail/:id", checkAuth, getContentDetail);

router.post("/create", checkAuth, checkRole([2]), validateCreate, createContent);

router.patch("/update/:id", checkAuth, checkRole([2]), validateEdit, updateContent);

router.put("/status/:id", checkAuth, checkRole([2]), changeStatusContent);

export default router;
