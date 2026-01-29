import express from 'express';
import { auth } from '../../../lib/auth.js';
import { toNodeHandler } from "better-auth/node";
import { AuthValidation } from './auth.validation.js';
import validateRequest from '../../middlewares/validateRequest.js';

const router = express.Router();

router.all(
    "/sign-up/email",
    validateRequest(AuthValidation.registrationSchema), // Better Auth এ যাওয়ার আগে চেক করবে
    toNodeHandler(auth)
);

router.all("/{*any}", async (req, res) => {
    return await toNodeHandler(auth)(req, res);
});

export const AuthRoutes = router;