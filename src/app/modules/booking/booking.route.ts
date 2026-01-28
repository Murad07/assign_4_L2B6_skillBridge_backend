import express, { Router } from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BookingValidation } from './booking.validation';
import { BookingController } from './booking.controller';

const router = express.Router();

// Student only - Create new booking
router.post(
    "/",
    auth(UserRole.STUDENT),
    validateRequest(BookingValidation.createBookingZodSchema),
    BookingController.createBooking
);

export const BookingRoutes: Router = router;