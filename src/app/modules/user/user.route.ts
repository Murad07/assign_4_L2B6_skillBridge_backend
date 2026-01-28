import express from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import { UserController } from './user.controller';

const router = express.Router();

// Admin only - list users
router.get('/', auth(UserRole.ADMIN), UserController.getAllUsersForAdmin);

// Admin only - get single user
router.get('/:id', auth(UserRole.ADMIN), UserController.getUserById);

export const UserRoutes = router;
