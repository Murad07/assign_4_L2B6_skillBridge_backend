import { NextFunction, Request, Response } from "express";
import { tutorService } from "./tutor.service";
import { UserRole } from "../../middlewares/auth";
import paginationSortingHelper from "../../../helpers/paginationSortingHelper";

const getAllTutors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { search } = req.query;
        const searchString = typeof search === 'string' ? search : undefined;

        const categoryId = req.query.categoryId ? req.query.categoryId as string : undefined;
        const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
        const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;
        const minRating = req.query.minRating ? parseFloat(req.query.minRating as string) : undefined;
        const expertise = req.query.expertise ? (req.query.expertise as string).split(',') : undefined;

        const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query);

        const tutors = await tutorService.getAllTutors({
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

        res.status(200).json(tutors);
    } catch (e) {
        next(e);
    }
}

const getTutorById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tutorId = req.params.id;
        if (!tutorId) {
            return res.status(400).json({
                error: "TUTOR ID is required"
            });
        }

        const tutor = await tutorService.getTutorById(tutorId as string);
        if (!tutor) {
            return res.status(404).json({
                error: "TUTOR not found"
            });
        }

        res.status(200).json(tutor);
    } catch (e) {
        next(e);
    }
}

const createTutorProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }

        if (user.role !== UserRole.TUTOR) {
            return res.status(403).json({
                error: "Forbidden - TUTOR access required"
            });
        }

        const result = await tutorService.createTutorProfile(req.body, user.id as string);
        res.status(201).json(result);
    } catch (e) {
        next(e);
    }
}

const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }

        const profile = await tutorService.getMyProfile(user.id as string);
        if (!profile) {
            return res.status(404).json({
                error: "TUTOR profile not found"
            });
        }

        res.status(200).json(profile);
    } catch (e) {
        next(e);
    }
}

const updateTutorProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }

        if (user.role !== UserRole.TUTOR) {
            return res.status(403).json({
                error: "Forbidden - TUTOR access required"
            });
        }

        const updateData = req.body;
        const updatedProfile = await tutorService.updateTutorProfile(updateData, user.id as string);

        res.status(200).json(updatedProfile);
    } catch (e) {
        next(e);
    }
}

const updateAvailability = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }

        if (user.role !== UserRole.TUTOR) {
            return res.status(403).json({
                error: "Forbidden - TUTOR access required"
            });
        }

        const { availability } = req.body;
        const updatedProfile = await tutorService.updateAvailability(user.id as string, availability);

        res.status(200).json(updatedProfile);
    } catch (e) {
        next(e);
    }
}

const getMySessions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }

        if (user.role !== UserRole.TUTOR) {
            return res.status(403).json({
                error: "Forbidden - TUTOR access required"
            });
        }

        const status = req.query.status as string | undefined;
        const sessions = await tutorService.getMySessions(user.id as string, status);

        res.status(200).json(sessions);
    } catch (e) {
        next(e);
    }
}

const getPendingTutors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }

        if (user.role !== UserRole.ADMIN) {
            return res.status(403).json({
                error: "Forbidden - ADMIN access required"
            });
        }

        const pendingTutors = await tutorService.getPendingTutors();
        res.status(200).json(pendingTutors);
    } catch (e) {
        next(e);
    }
}

const approveTutor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }

        if (user.role !== UserRole.ADMIN) {
            return res.status(403).json({
                error: "Forbidden - ADMIN access required"
            });
        }

        const tutorId = req.params.id;
        const approvedTutor = await tutorService.approveTutor(tutorId as string);

        res.status(200).json(approvedTutor);
    } catch (e) {
        next(e);
    }
}

const rejectTutor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }

        if (user.role !== UserRole.ADMIN) {
            return res.status(403).json({
                error: "Forbidden - ADMIN access required"
            });
        }

        const tutorId = req.params.id;
        const rejectedTutor = await tutorService.rejectTutor(tutorId as string);

        res.status(200).json(rejectedTutor);
    } catch (e) {
        next(e);
    }
}

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