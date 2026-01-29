import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import { ReviewService } from './review.service.js';

const createReview = catchAsync(async (req: Request, res: Response) => {
    const studentId = req.user?.id as string;
    const payload = req.body;

    const result = await ReviewService.createReview(studentId, payload);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Review created successfully',
        data: result,
    });
});

export const ReviewController = {
    createReview,
};
