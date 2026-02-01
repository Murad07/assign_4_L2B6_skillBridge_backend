import { z } from 'zod';

const updateUserStatusZodSchema = z.object({
    params: z.object({
        id: z.string({ message: 'User id is required' }),
    }),
    body: z.object({
        status: z.enum(['ACTIVE', 'INACTIVE', 'BANNED'] as const, { message: 'Status is required' }),
    }),
});

const updateUserRoleZodSchema = z.object({
    params: z.object({
        id: z.string({ message: 'User id is required' }),
    }),
    body: z.object({
        role: z.enum(['Student', 'Tutor', 'Admin'] as const, {
            message: 'Role is required and must be one of STUDENT, TUTOR, ADMIN',
        }),
    }),
});

const updateUserProfileZodSchema = z.object({
    body: z.object({
        name: z.string().min(1).optional(),
        phone: z.string().min(5).optional(),
    }),
});

export const UserValidation = {
    updateUserStatusZodSchema,
    updateUserProfileZodSchema,
    updateUserRoleZodSchema,
};
