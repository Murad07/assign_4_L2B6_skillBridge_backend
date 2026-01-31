import express, { Router } from 'express';
import auth, { UserRole } from '../../middlewares/auth.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { BookingValidation } from './booking.validation.js';
import { BookingController } from './booking.controller.js';

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

// Admin - get all bookings with pagination/filtering
router.get(
    "/admin",
    auth(UserRole.ADMIN),
    BookingController.getAllBookingsForAdmin
);

// Update booking status - Student (cancel) or Tutor (complete)
router.patch(
    "/:id/status",
    auth(UserRole.STUDENT, UserRole.TUTOR),
    validateRequest(BookingValidation.updateBookingStatusZodSchema),
    BookingController.updateBookingStatus
);

// Get single booking - Student, Tutor or Admin (permission checked in service)
router.get(
    "/:id",
    auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN),
    BookingController.getBookingById
);



export const BookingRoutes: Router = router;