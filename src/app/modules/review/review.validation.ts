import { z } from 'zod';

const createReviewZodSchema = z.object({
    body: z.object({
        bookingId: z.string({ message: 'Booking ID is required' }),
        rating: z.number({ message: 'Rating is required' }).int().min(1).max(5),
        comment: z.string({ message: 'Comment is required' }).min(1),
    }),
});

export const ReviewValidation = {
    createReviewZodSchema,
};
