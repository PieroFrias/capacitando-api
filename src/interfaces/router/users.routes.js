import express from 'express';
import checkAuth from '../middleware/authMiddleware.js';
import checkRole from '../middleware/roleMiddleware.js';
import {
  authenticateUser,
  getAllUsersAdmin,
  createUser,
} from '../controller/userController.js';

const router = express.Router();

router.get('/admin/list', checkAuth, checkRole([1]), getAllUsersAdmin);

router.post('/login', authenticateUser);
router.post('/admin/create', checkAuth, checkRole([1]), createUser);

export default router;
