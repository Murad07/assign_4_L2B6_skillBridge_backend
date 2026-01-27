import express from 'express';
import { auth } from '../../../lib/auth';
import { toNodeHandler } from "better-auth/node";

const router = express.Router();

router.all("/{*any}", async (req, res) => {
    return await toNodeHandler(auth)(req, res);
});

export const AuthRoutes = router;