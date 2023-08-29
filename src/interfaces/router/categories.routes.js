import express from "express";
import checkAuth from '../middleware/authMiddleware.js';
import checkRole from '../middleware/roleMiddleware.js';
import {
  getAllCategories,
  getCategoryDetail,
  createCategory,
  updateCategory,
  changeStatusCategory,
} from "../controller/categoryController.js"

const router = express.Router();

router.get("/detail/:id", checkAuth, checkRole([1, 2, 3]), getCategoryDetail);

router.post("/list", checkAuth, getAllCategories);
router.post("/create", checkAuth, checkRole([1]), createCategory);

router.patch("/update/:id", checkAuth, checkRole([1]), updateCategory);

router.put("/status/:id", checkAuth, checkRole([1]), changeStatusCategory);

export default router;

