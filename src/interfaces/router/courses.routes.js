import express from "express";
import {
  getAllCourses,
  getCourseDetail,
} from "../controller/courseController.js"

const router = express.Router();

router.post("/list", getAllCourses);

router.get("/detail/:id", getCourseDetail);

export default router;
