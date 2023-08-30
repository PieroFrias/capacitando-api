import express from "express";
import checkAuth from '../middleware/authMiddleware.js';
import checkRole from '../middleware/roleMiddleware.js';
import { validateCreate, validateEdit } from "../middleware/validators/categoryValidator.js";
import {
  getAllCategories,
  getCategoryDetail,
  createCategory,
  updateCategory,
  changeStatusCategory,
} from "../controller/categoryController.js"

const router = express.Router();

router.get("/list", checkAuth, getAllCategories);
router.get("/detail/:id", checkAuth, getCategoryDetail);

router.post("/create", checkAuth, checkRole([1]), validateCreate, createCategory);

router.patch("/update/:id", checkAuth, checkRole([1]), validateEdit, updateCategory);

router.put("/status/:id", checkAuth, checkRole([1]), changeStatusCategory);

export default router;

