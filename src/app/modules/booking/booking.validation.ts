import { z } from 'zod';

const createBookingZodSchema = z.object({
  body: z.object({
    tutorId: z.string({
      message: 'Tutor ID is required',
    }),
    sessionDate: z.string({
      message: 'Session date is required',
    }).refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format for sessionDate',
    }),
    sessionTime: z.string({
      message: 'Session time is required',
    }),
    duration: z.number({
      message: 'Duration is required',
    }).int().positive(),
    subject: z.string({
      message: 'Subject is required',
    }),
    price: z.number({
      message: 'Price is required',
    }).positive(),
    notes: z.string().optional(),
  }),
});

export const BookingValidation = {
  createBookingZodSchema,
};
