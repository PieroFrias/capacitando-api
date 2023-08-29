import express from 'express';
import checkAuth from '../middleware/authMiddleware.js';
import checkRole from '../middleware/roleMiddleware.js';
import {
  authenticateUser,
  getAllUsersAdmin,
  getAllUsersAdminPaginated,
  getUserDetail,
  createUser,
  getProfile,
  updateUser,
  addUpdateImageUser,
  deleteImageUser,
  uploadImage,
  changeStatusUser,
} from '../controller/userController.js';

const router = express.Router();

router.get("/profile", checkAuth, getProfile);
router.get("/detail/:id", checkAuth, getUserDetail);
router.get('/admin/list', checkAuth, checkRole([1]), getAllUsersAdmin);
router.get('/admin/list-paginate', checkAuth, checkRole([1]), getAllUsersAdminPaginated);

router.post('/login', authenticateUser);
router.post('/admin/create', checkAuth, checkRole([1]), createUser);
router.put("/image/:id", checkAuth, uploadImage.single("foto"), addUpdateImageUser);

router.patch('/update/:id', checkAuth, updateUser);

router.put('/status/:id', checkAuth, checkRole([1]), changeStatusUser);

router.delete("/delete/image/:id", checkAuth, deleteImageUser);

export default router;
