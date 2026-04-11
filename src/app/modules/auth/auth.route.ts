import express from 'express';
import { auth } from '../../../lib/auth.js';
import { toNodeHandler } from "better-auth/node";
import { AuthValidation } from './auth.validation.js';
import validateRequest from '../../middlewares/validateRequest.js';
import checkAuth from '../../middlewares/auth.js';
import { AuthController } from './auth.controller.js';

const router = express.Router();

router.get(
    "/me",
    checkAuth(),
    AuthController.getMe
);

// ✅ Add this BEFORE the catch-all toNodeHandler
router.get("/session-exchange", async (req, res) => {
    try {
        const token = req.headers["x-session-token"] as string;

        if (!token) {
            res.status(401).json({ error: "No token provided" });
            return;
        }

        // Build a fake Request so better-auth can validate the token
        const backendUrl =
            process.env.BETTER_AUTH_URL ||
            "https://assign-4-l2-b6-skill-bridge-backend.vercel.app";

        const fakeRequest = new Request(
            `${backendUrl}/api/auth/get-session`,
            {
                headers: {
                    "Cookie": `better-auth.session_token=${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const sessionRes = await auth.handler(fakeRequest);
        const data = await sessionRes.json();

        if (!data?.user) {
            res.status(401).json({ error: "Invalid or expired session" });
            return;
        }

        res.json({
            success: true,
            user: data.user,
            session: data.session,
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message || "Session exchange failed" });
    }
});

router.all(
    "/sign-up/email",
    validateRequest(AuthValidation.registrationSchema),
    toNodeHandler(auth)
);

// Catch-all — must stay LAST
router.use((req, res) => {
    return toNodeHandler(auth)(req, res);
});

export const AuthRoutes = router;