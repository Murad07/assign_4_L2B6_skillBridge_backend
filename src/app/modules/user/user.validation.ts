import { z } from 'zod';

const updateUserStatusZodSchema = z.object({
    params: z.object({
        id: z.string({ message: 'User id is required' }),
    }),
    body: z.object({
        status: z.enum(['ACTIVE', 'INACTIVE', 'BANNED'] as const, { message: 'Status is required' }),
    }),
});

export const UserValidation = {
    updateUserStatusZodSchema,
};
