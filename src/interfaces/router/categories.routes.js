import express from "express";
import checkAuth from '../middleware/authMiddleware.js';
import {
    // getAllCategories,
    getCategoryDetail,
    // createCategorie,
    // updateCategorie,
    // changeStatusCategorie,
} from "../controller/categoryController.js"

const router = express.Router();

router.get("/detail/:id", checkAuth, getCategoryDetail);

// router.post("/list", checkAuth, checkRole([1, 2, 3]), getAllCategories);
// router.post("/create", checkAuth, checkRole([1]), createCategorie);

// router.patch("/update/:id", checkAuth, checkRole([1]), updateCategorie);

export default router;

