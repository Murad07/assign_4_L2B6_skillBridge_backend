import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import { UserService } from './user.service.js';

const getAllUsersForAdmin = catchAsync(async (req: Request, res: Response) => {
    const { page, limit, role, status, search } = req.query;

    const opts = {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        role: role ? String(role) : undefined,
        status: status ? String(status) : undefined,
        search: search ? String(search) : undefined,
    };

    const result = await UserService.getAllUsersForAdmin(opts);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Users fetched successfully',
        data: result,
    });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
    const id = String(req.params.id);
    const user = await UserService.getUserById(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'User fetched successfully',
        data: user,
    });
});

const patchUserStatus = catchAsync(async (req: Request, res: Response) => {
    const id = String(req.params.id);
    const status = String(req.body.status);

    const updated = await UserService.updateUserStatus(id, status);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'User status updated successfully',
        data: updated,
    });
});

const patchUserProfile = catchAsync(async (req: Request, res: Response) => {
    const id = req.user?.id as string;
    const { name, phone } = req.body;

    const updated = await UserService.updateUserProfile(id, { name, phone });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Profile updated successfully',
        data: updated,
    });
});

export const UserController = {
    getAllUsersForAdmin,
    getUserById,
    patchUserStatus,
    patchUserProfile,
};



