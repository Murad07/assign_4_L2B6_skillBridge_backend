import { NextFunction, Request, Response } from "express";
import { tutorService } from "./tutor.service.js";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import paginationSortingHelper from "../../../helpers/paginationSortingHelper.js";

const getAllTutors = catchAsync(async (req: Request, res: Response) => {
    const { search } = req.query;
    const searchString = typeof search === 'string' ? search : undefined;

    const categoryId = req.query.categoryId ? req.query.categoryId as string : undefined;
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;
    const minRating = req.query.minRating ? parseFloat(req.query.minRating as string) : undefined;
    const expertise = req.query.expertise ? (req.query.expertise as string).split(',') : undefined;

    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query);

    const result = await tutorService.getAllTutors({
        search: searchString,
        categoryId,
        minPrice,
        maxPrice,
        minRating,
        expertise,
        page,
        limit,
        skip,
        sortBy,
        sortOrder
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tutors fetched successfully',
        data: result
    });
});

const getTutorById = catchAsync(async (req: Request, res: Response) => {
    const tutorId = req.params.id;
    if (!tutorId) {
        return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: 'Tutor ID is required',
        });
    }

    const result = await tutorService.getTutorById(tutorId as string);
    if (!result) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: 'Tutor not found',
        });
    }

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tutor fetched successfully',
        data: result
    });
});

const createTutorProfile = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const result = await tutorService.createTutorProfile(req.body, user?.id as string);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Tutor profile created successfully',
        data: result
    });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const result = await tutorService.getMyProfile(user?.id as string);

    if (!result) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: 'Tutor profile not found',
        });
    }

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tutor profile fetched successfully',
        data: result
    });
});

const updateTutorProfile = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const updateData = req.body;
    const result = await tutorService.updateTutorProfile(updateData, user?.id as string);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tutor profile updated successfully',
        data: result
    });
});

const updateAvailability = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const { availability } = req.body;
    const result = await tutorService.updateAvailability(user?.id as string, availability);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Availability updated successfully',
        data: result
    });
});

const getMySessions = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const status = req.query.status as string | undefined;
    const result = await tutorService.getMySessions(user?.id as string, status);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Sessions fetched successfully',
        data: result
    });
});

const getPendingTutors = catchAsync(async (req: Request, res: Response) => {
    const result = await tutorService.getPendingTutors();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Pending tutors fetched successfully',
        data: result
    });
});

const approveTutor = catchAsync(async (req: Request, res: Response) => {
    const tutorId = req.params.id;
    const result = await tutorService.approveTutor(tutorId as string);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tutor approved successfully',
        data: result
    });
});

const rejectTutor = catchAsync(async (req: Request, res: Response) => {
    const tutorId = req.params.id;
    const result = await tutorService.rejectTutor(tutorId as string);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tutor rejected successfully',
        data: result
    });
});

export const TutorController = {
    getAllTutors,
    getTutorById,
    createTutorProfile,
    getMyProfile,
    updateTutorProfile,
    updateAvailability,
    getMySessions,
    getPendingTutors,
    approveTutor,
    rejectTutor
};