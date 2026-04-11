import express from 'express';
import auth, { UserRole } from '../../middlewares/auth.js';
import { OverviewController } from './overview.controller.js';

const router = express.Router();

router.get(
    '/',
    auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN, UserRole.MANAGER, UserRole.MODERATOR),
    OverviewController.getOverview
);

export const OverviewRoutes = router;
