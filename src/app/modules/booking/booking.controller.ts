import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BookingService } from "./booking.service";
import { UserRole } from "../../middlewares/auth";

const createBooking = catchAsync(async (req: Request, res: Response) => {
    // Student ID will come from the authenticated user
    const studentId = req.user?.id;
    const result = await BookingService.createBooking(studentId as string, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Booking created successfully",
        data: result,
    });
});

// const getUsersBookings = catchAsync(async (req: Request, res: Response) => {
//     const userId = req.user?.id;
//     const userRole = req.user?.role;

//     const result = await BookingService.getUsersBookings(userId as string, userRole as UserRole);

//     sendResponse(res, {
//         statusCode: 200,
//         success: true,
//         message: "User bookings fetched successfully",
//         data: result,
//     });
// });

export const BookingController = {
    createBooking,
    // getUsersBookings,
};