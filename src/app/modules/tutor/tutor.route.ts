import express, { Router } from 'express';
import { TutorController } from './tutor.controller.js';
import auth, { UserRole } from '../../middlewares/auth.js';

const router = express.Router();

// Public routes - Browse tutors
router.get("/",
    TutorController.getAllTutors
);

router.get("/:id",
    TutorController.getTutorById
);

// TUTOR routes - Profile management
router.post(
    "/profile",
    auth(UserRole.TUTOR),
    TutorController.createTutorProfile
);

router.get(
    "/profile/me",
    auth(UserRole.TUTOR),
    TutorController.getMyProfile
);

router.patch(
    "/profile",
    auth(UserRole.TUTOR),
    TutorController.updateTutorProfile
);

router.patch(
    "/availability",
    auth(UserRole.TUTOR),
    TutorController.updateAvailability
);

router.get(
    "/sessions/my-sessions",
    auth(UserRole.TUTOR),
    TutorController.getMySessions
);

// ADMIN routes - TUTOR approval
router.get(
    "/admin/pending",
    auth(UserRole.ADMIN),
    TutorController.getPendingTutors
);

router.patch(
    "/admin/:id/approve",
    auth(UserRole.ADMIN),
    TutorController.approveTutor
);

router.patch(
    "/admin/:id/reject",
    auth(UserRole.ADMIN),
    TutorController.rejectTutor
);

export const TutorRouter: Router = router;