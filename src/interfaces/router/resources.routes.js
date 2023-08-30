import express from "express";
import checkAuth from '../middleware/authMiddleware.js';
import checkRole from '../middleware/roleMiddleware.js';
import { validateCreate, validateEdit } from "../middleware/validators/resourceValidator.js";
import {
  getAllResources,
  getResourceDetail,
  createResource,
  updateResource,
  changeStatusResource,
} from "../controller/resourceController.js"

const router = express.Router();

router.get("/list/:id", checkAuth, getAllResources);
router.get("/detail/:id", checkAuth, getResourceDetail);

router.post("/create", checkAuth, checkRole([2]), validateCreate, createResource);

router.patch("/update/:id", checkAuth, checkRole([2]), validateEdit, updateResource);

router.put("/status/:id", checkAuth, checkRole([2]), changeStatusResource);

export default router;
