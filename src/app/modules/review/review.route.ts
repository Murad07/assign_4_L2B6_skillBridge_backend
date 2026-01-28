import express from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewValidation } from './review.validation';
import { ReviewController } from './review.controller';

const router = express.Router();

// Student only - create review
router.post(
    '/',
    auth(UserRole.STUDENT),
    validateRequest(ReviewValidation.createReviewZodSchema),
    ReviewController.createReview
);

export const ReviewRoutes = router;
