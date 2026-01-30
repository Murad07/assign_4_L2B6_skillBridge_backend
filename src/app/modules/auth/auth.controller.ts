import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import { UserService } from '../user/user.service.js';

const getMe = catchAsync(async (req: Request, res: Response) => {
    // req.user is populated by the auth middleware
    // We fetch the latest user data from the database using the ID from the session
    const id = req.user?.id;

    if (!id) {
        throw new Error("User ID not found in request");
    }

    const result = await UserService.getUserById(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Current user retrieved successfully',
        data: result,
    });
});

export const AuthController = {
    getMe,
};
