import { Booking, BookingStatus, TutorProfile } from "@prisma/client";
import { prisma } from "../../../lib/prisma";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { UserRole } from "../../middlewares/auth";

type ICreateBookingPayload = {
    tutorId: string;
    sessionDate: string; // Date string to be converted to DateTime
    sessionTime: string;
    duration: number;
    subject: string;
    price: number;
    notes?: string;
}

const createBooking = async (studentId: string, payload: ICreateBookingPayload): Promise<Booking> => {
    const { tutorId, sessionDate, sessionTime, duration, subject, price, notes } = payload;

    // 1. Verify Tutor
    const tutor = await prisma.tutorProfile.findUnique({
        where: { id: tutorId },
        include: { user: true }
    });

    if (!tutor) {
        throw new ApiError(httpStatus.NOT_FOUND, "Tutor not found");
    }
    if (!tutor.isApproved) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Tutor is not approved");
    }

    // 2. Check Tutor Availability
    // Availability is stored as JSON: [{ day: "Monday", slots: ["09:00-10:00", "10:00-11:00"] }]
    const sessionDay = new Date(sessionDate).toLocaleString('en-US', { weekday: 'long' });
    const tutorAvailability = tutor.availability as any; // Cast to any to access properties safely

    const dayAvailability = tutorAvailability?.find((slot: any) => slot.day === sessionDay);

    // Helper: convert "HH:MM" to minutes since 00:00
    const toMinutes = (t: string) => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
    };

    // Check if a given start time (e.g. "10:00") falls within a slot like "09:00-10:00" or "10:00-11:00".
    const isTimeInSlot = (startTime: string, slotRange: string) => {
        const [slotStart, slotEnd] = slotRange.split('-');
        const startMin = toMinutes(startTime);
        const slotStartMin = toMinutes(slotStart);
        const slotEndMin = toMinutes(slotEnd);
        // consider a start time valid if it is >= slotStart and < slotEnd
        return startMin >= slotStartMin && startMin < slotEndMin;
    };

    const isAvailable = !!dayAvailability && Array.isArray(dayAvailability.slots) &&
        dayAvailability.slots.some((slot: string) => isTimeInSlot(sessionTime, slot));

    if (!isAvailable) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Tutor is not available at the requested time");
    }

    // 3. Prevent Double-Booking for Tutor
    const existingTutorBooking = await prisma.booking.findFirst({
        where: {
            // booking.tutorId references User.id, so use tutor.userId (the tutor's user id)
            tutorId: tutor.userId,
            sessionDate: new Date(sessionDate),
            sessionTime: sessionTime,
            status: {
                not: BookingStatus.CANCELLED // Consider CONFIRMED or COMPLETED as occupied
            }
        }
    });

    if (existingTutorBooking) {
        throw new ApiError(httpStatus.CONFLICT, "Tutor already has a booking at this time");
    }

    // 4. Prevent Double-Booking for Student (optional, but good practice)
    const existingStudentBooking = await prisma.booking.findFirst({
        where: {
            studentId: studentId,
            sessionDate: new Date(sessionDate),
            sessionTime: sessionTime,
            status: {
                not: BookingStatus.CANCELLED
            }
        }
    });

    if (existingStudentBooking) {
        throw new ApiError(httpStatus.CONFLICT, "You already have a booking at this time");
    }

    const bookingData = {
        studentId: studentId,
        // booking.tutorId references User.id, so store the tutor's user id here
        tutorId: tutor.userId,
        sessionDate: new Date(sessionDate),
        sessionTime: sessionTime,
        duration: duration,
        subject: subject,
        price: price,
        notes: notes,
        status: BookingStatus.CONFIRMED, // Default to confirmed upon creation
        meetingLink: `https://skillbridge.com/meet/${studentId}-${tutor.userId}-${Date.now()}`, // Placeholder for a real meeting link
    };

    const newBooking = await prisma.booking.create({
        data: bookingData,
    });

    return newBooking;
};

const getUsersBookings = async (userId: string, userRole: UserRole) => {
    // Build where filter depending on role
    let where: any = {};

    if (userRole === UserRole.TUTOR) {
        where.tutorId = userId;
    } else if (userRole === UserRole.STUDENT) {
        where.studentId = userId;
    } else {
        // unauthorized for other roles in this service method
        throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to view bookings');
    }

    const bookings = await prisma.booking.findMany({
        where,
        include: {
            student: { select: { id: true, name: true, email: true } },
            tutor: { select: { id: true, name: true, email: true } },
            review: true,
        },
        orderBy: [{ sessionDate: 'desc' }, { sessionTime: 'desc' }],
    });

    return bookings;
};

const getBookingById = async (bookingId: string, requesterId: string, requesterRole: UserRole) => {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            student: { select: { id: true, name: true, email: true } },
            tutor: { select: { id: true, name: true, email: true } },
            review: true,
        }
    });

    if (!booking) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
    }

    // Permission checks
    if (requesterRole === UserRole.STUDENT && booking.studentId !== requesterId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to view this booking');
    }
    if (requesterRole === UserRole.TUTOR && booking.tutorId !== requesterId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to view this booking');
    }

    return booking;
};

const getAllBookingsForAdmin = async (options: {
    page?: number;
    limit?: number;
    status?: string;
    tutorId?: string;
    studentId?: string;
    fromDate?: string;
    toDate?: string;
}) => {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (options.status) where.status = options.status;
    if (options.tutorId) where.tutorId = options.tutorId;
    if (options.studentId) where.studentId = options.studentId;
    if (options.fromDate || options.toDate) {
        where.sessionDate = {};
        if (options.fromDate) where.sessionDate.gte = new Date(options.fromDate);
        if (options.toDate) where.sessionDate.lte = new Date(options.toDate);
    }

    const [total, bookings] = await Promise.all([
        prisma.booking.count({ where }),
        prisma.booking.findMany({
            where,
            include: {
                student: { select: { id: true, name: true, email: true } },
                tutor: { select: { id: true, name: true, email: true } },
                review: true,
            },
            orderBy: [{ sessionDate: 'desc' }, { sessionTime: 'desc' }],
            skip,
            take: limit,
        })
    ]);

    return {
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
        data: bookings,
    };
};

export const BookingService = {
    createBooking,
    getUsersBookings,
    getBookingById,
    getAllBookingsForAdmin,
};