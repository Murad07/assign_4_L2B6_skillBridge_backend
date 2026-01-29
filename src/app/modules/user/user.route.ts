import express from 'express';
import auth, { UserRole } from '../../middlewares/auth.js';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest.js';
import { UserValidation } from './user.validation.js';

const router = express.Router();

// Admin only - list users
router.get('/', auth(UserRole.ADMIN), UserController.getAllUsersForAdmin);

// Admin only - get single user
router.get('/:id', auth(UserRole.ADMIN), UserController.getUserById);

// Admin only - update user status
router.patch('/:id', auth(UserRole.ADMIN), validateRequest(UserValidation.updateUserStatusZodSchema), UserController.patchUserStatus);

export const UserRoutes = router;
