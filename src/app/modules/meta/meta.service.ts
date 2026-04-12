import { prisma } from "../../../lib/prisma.js";

export const MetaService = {
    getPublicStats: async () => {
        const [tutors, students, bookings, categories] = await Promise.all([
            prisma.user.count({ where: { role: 'Tutor' } }),
            prisma.user.count({ where: { role: 'Student' } }),
            prisma.booking.count({ where: { status: 'COMPLETED' } }),
            prisma.category.count({ where: { isActive: true } })
        ]);

        return {
            tutors: tutors > 5 ? `${tutors}+` : tutors.toString(),
            students: students > 10 ? `${students}+` : students.toString(),
            sessions: bookings > 20 ? `${bookings}+` : bookings.toString(),
            subjects: categories > 5 ? `${categories}+` : categories.toString()
        };
    }
};
