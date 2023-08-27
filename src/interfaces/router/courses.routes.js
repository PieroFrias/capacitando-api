import express from "express";
import checkAuth from '../middleware/authMiddleware.js';
import checkRole from '../middleware/roleMiddleware.js';
import {
  getAllCourses,
  getCourseDetail,
  createCourse,
  updateCourse,
  changeStatusCourse,
  addUpdateImageCourse,
  deleteImageCourse,
  uploadImage,
} from "../controller/courseController.js"

const router = express.Router();

router.get("/detail/:id", checkAuth, getCourseDetail);

router.post("/list", checkAuth, checkRole([1, 2, 3]), getAllCourses);
router.post("/create", checkAuth, checkRole([1]), createCourse);

router.patch("/update/:id", checkAuth, checkRole([1]), updateCourse);

router.put("/image/:id", checkAuth, checkRole([1]), uploadImage.single("url_portada"), addUpdateImageCourse);
router.put("/status/:id", checkAuth, checkRole([1]), changeStatusCourse);

router.delete("/delete/image/:id", checkAuth, checkRole([1]), deleteImageCourse);

export default router;
