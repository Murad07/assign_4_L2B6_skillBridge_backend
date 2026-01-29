import express from 'express';
import auth, { UserRole } from '../../middlewares/auth.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { ReviewValidation } from './review.validation.js';
import { ReviewController } from './review.controller.js';

const router = express.Router();

// Student only - create review
router.post(
    '/',
    auth(UserRole.STUDENT),
    validateRequest(ReviewValidation.createReviewZodSchema),
    ReviewController.createReview
);

export const ReviewRoutes = router;
