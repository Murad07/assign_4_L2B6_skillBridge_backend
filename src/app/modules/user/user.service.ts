import { prisma } from '../../../lib/prisma.js';
import ApiError from '../../../errors/ApiError.js';
import httpStatus from 'http-status';

type IAdminListOptions = {
    page?: number;
    limit?: number;
    role?: string;
    status?: string;
    search?: string;
};

const getAllUsersForAdmin = async (opts: IAdminListOptions) => {
    const page = opts.page && opts.page > 0 ? opts.page : 1;
    const limit = opts.limit && opts.limit > 0 ? opts.limit : 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (opts.role) where.role = opts.role;
    if (opts.status) where.status = opts.status;
    if (opts.search) {
        where.OR = [
            { name: { contains: opts.search, mode: 'insensitive' } },
            { email: { contains: opts.search, mode: 'insensitive' } },
        ];
    }

    const [total, users] = await Promise.all([
        prisma.user.count({ where }),
        prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                tutorProfile: {
                    select: {
                        id: true,
                        hourlyRate: true,
                        rating: true,
                        totalReviews: true,
                        isApproved: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        }),
    ]);

    return {
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
        data: users,
    };
};

const getUserById = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id },
        include: { tutorProfile: true },
    });

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    return user;
};



const updateUserStatus = async (id: string, status: string) => {
    const allowed = ['ACTIVE', 'INACTIVE', 'BANNED'];
    if (!allowed.includes(status)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid status value');
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    const updated = await prisma.user.update({ where: { id }, data: { status } });
    return updated;
};

const updateUserRole = async (id: string, role: string) => {
    const allowedRoles = ['Student', 'Tutor', 'Admin'];
    if (!allowedRoles.includes(role)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid role value');
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    const updated = await prisma.user.update({ where: { id }, data: { role } });
    return updated;
};

const updateUserProfile = async (id: string, payload: { name?: string; phone?: string }) => {
    const { name, phone } = payload;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    const updated = await prisma.user.update({
        where: { id },
        data: {
            ...(name ? { name } : {}),
            ...(phone ? { phone } : {}),
        },
    });

    return updated;
};

export const UserService = {
    getAllUsersForAdmin,
    getUserById,
    updateUserStatus,
    updateUserRole,
    updateUserProfile,
};


