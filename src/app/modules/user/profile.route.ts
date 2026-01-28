import express from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import { UserController } from './user.controller';

const router = express.Router();

// Current user profile update (Student/Tutor)
router.patch(
    '/profile',
    auth(UserRole.STUDENT, UserRole.TUTOR),
    validateRequest(UserValidation.updateUserProfileZodSchema),
    UserController.patchUserProfile
);

export const ProfileRoutes = router;
