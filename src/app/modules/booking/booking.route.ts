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

// Student or Tutor - Get user's bookings
router.get(
    "/",
    auth(UserRole.STUDENT, UserRole.TUTOR),
    BookingController.getUsersBookings
);

// Get single booking - Student, Tutor or Admin (permission checked in service)
router.get(
    "/:id",
    auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN),
    BookingController.getBookingById
);

export const BookingRoutes: Router = router;