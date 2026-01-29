import express from 'express';
import auth, { UserRole } from '../../middlewares/auth.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { UserValidation } from './user.validation.js';
import { UserController } from './user.controller.js';

const router = express.Router();

// Current user profile update (Student/Tutor)
router.patch(
    '/profile',
    auth(UserRole.STUDENT, UserRole.TUTOR),
    validateRequest(UserValidation.updateUserProfileZodSchema),
    UserController.patchUserProfile
);

export const ProfileRoutes = router;
