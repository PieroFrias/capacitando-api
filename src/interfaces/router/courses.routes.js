import express from "express";
import checkAuth from '../middleware/authMiddleware.js';
import checkRole from '../middleware/roleMiddleware.js';
import { validateStatus } from "../middleware/validators/statusValidator.js";
import { validateCreate, validateEdit } from "../middleware/validators/courseValidator.js";
import {
  getAllCourses,
  getAllCoursesPaginated,
  getCourseDetail,
  createCourse,
  addCourseUser,
  deleteCourseUser,
  updateCourse,
  changeStatusCourse,
  addUpdateImageCourse,
  deleteImageCourse,
  uploadImage,
} from "../controller/courseController.js"

const router = express.Router();

router.get("/detail/:id", checkAuth, getCourseDetail);
router.get("/list", checkAuth, getAllCourses);
router.get("/list-paginate", checkAuth, getAllCoursesPaginated);

router.post("/create", checkAuth, checkRole([1]), validateCreate, createCourse);
router.post("/add/user", checkAuth, checkRole([1]), addCourseUser);

router.patch("/update/:id", checkAuth, checkRole([1]), validateEdit, updateCourse);

router.put("/image/:id", checkAuth, checkRole([1]), uploadImage.single("url_portada"), addUpdateImageCourse);
router.put("/status/:id", checkAuth, checkRole([1]), validateStatus, changeStatusCourse);

router.delete("/delete/user", checkAuth, checkRole([1]), deleteCourseUser);
router.delete("/delete/image/:id", checkAuth, checkRole([1]), deleteImageCourse);

export default router;
