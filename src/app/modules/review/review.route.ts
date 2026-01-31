import express from 'express';
import auth, { UserRole } from '../../middlewares/auth.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { ReviewValidation } from './review.validation.js';
import { ReviewController } from './review.controller.js';

const router = express.Router();

// get reviews for a tutor
router.get(
    '/:tutorId',
    auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN),
    ReviewController.getReviewsForTutor
);

// Student only - create review
router.post(
    '/',
    auth(UserRole.STUDENT),
    validateRequest(ReviewValidation.createReviewZodSchema),
    ReviewController.createReview
);

export const ReviewRoutes = router;
