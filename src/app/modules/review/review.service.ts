import { prisma } from '../../../lib/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { BookingStatus } from '@prisma/client';

type ICreateReviewPayload = {
    bookingId: string;
    rating: number;
    comment: string;
};

const createReview = async (studentId: string, payload: ICreateReviewPayload) => {
    const { bookingId, rating, comment } = payload;

    // 1. Verify booking exists
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
    }

    // 2. Only the student who had the booking can leave a review
    if (booking.studentId !== studentId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to review this booking');
    }

    // 3. Ensure the session is completed
    if (booking.status !== BookingStatus.COMPLETED) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'You can only review a completed session');
    }

    // 4. Ensure only one review per booking
    const existingReview = await prisma.review.findUnique({ where: { bookingId } });
    if (existingReview) {
        throw new ApiError(httpStatus.CONFLICT, 'A review for this booking already exists');
    }

    // 5. Create review (and update tutorProfile in a transaction if profile exists)
    const tutorProfile = await prisma.tutorProfile.findUnique({ where: { userId: booking.tutorId } });

    if (tutorProfile) {
        const prevTotal = tutorProfile.totalReviews ?? 0;
        const prevRating = tutorProfile.rating ?? 0;
        const newTotal = prevTotal + 1;
        const newRating = (prevRating * prevTotal + rating) / newTotal;

        const [created] = await prisma.$transaction([
            prisma.review.create({
                data: {
                    bookingId,
                    studentId,
                    tutorId: booking.tutorId,
                    rating,
                    comment,
                },
            }),
            prisma.tutorProfile.update({
                where: { userId: booking.tutorId },
                data: {
                    totalReviews: newTotal,
                    rating: newRating,
                },
            }),
        ]);

        return created;
    }

    // If no tutor profile, just create the review
    const created = await prisma.review.create({
        data: {
            bookingId,
            studentId,
            tutorId: booking.tutorId,
            rating,
            comment,
        },
    });

    return created;
};

const getReviewsForTutor = async (tutorId: string) => {
    return prisma.review.findMany({ where: { tutorId } });
};

export const ReviewService = {
    createReview,
    getReviewsForTutor,
};
