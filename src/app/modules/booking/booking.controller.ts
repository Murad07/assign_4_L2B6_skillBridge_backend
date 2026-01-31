import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { BookingService } from "./booking.service.js";
import { UserRole } from "../../middlewares/auth.js";
import { BookingStatus } from "@prisma/client";

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

const getUsersBookings = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const result = await BookingService.getUsersBookings(userId as string, userRole as UserRole);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User bookings fetched successfully",
        data: result,
    });
});

const getBookingById = catchAsync(async (req: Request, res: Response) => {
    const bookingId = req.params.id;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const result = await BookingService.getBookingById(bookingId as string, userId as string, userRole as UserRole);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Booking fetched successfully',
        data: result,
    });
});

const getAllBookingsForAdmin = catchAsync(async (req: Request, res: Response) => {
    const { page, limit, status, tutorId, studentId, fromDate, toDate } = req.query;

    const parsed = {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        status: status ? String(status) : undefined,
        tutorId: tutorId ? String(tutorId) : undefined,
        studentId: studentId ? String(studentId) : undefined,
        fromDate: fromDate ? String(fromDate) : undefined,
        toDate: toDate ? String(toDate) : undefined,
    };

    const result = await BookingService.getAllBookingsForAdmin(parsed);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Bookings fetched successfully',
        data: result,
    });
});

const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
    const bookingId = req.params.id;
    const userId = req.user?.id as string;
    const userRole = req.user?.role as UserRole;
    const { status } = req.body as { status: BookingStatus };

    const result = await BookingService.updateBookingStatus(bookingId as string, userId, userRole, status);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Booking status updated successfully',
        data: result,
    });
});

export const BookingController = {
    createBooking,
    getUsersBookings,
    getBookingById,
    getAllBookingsForAdmin,
    updateBookingStatus
};