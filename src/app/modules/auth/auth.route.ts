import express, { Request, Response } from 'express';
import { auth } from '../../../lib/auth.js';
import { toNodeHandler } from "better-auth/node";
import { AuthValidation } from './auth.validation.js';
import validateRequest from '../../middlewares/validateRequest.js';
import checkAuth from '../../middlewares/auth.js';
import { AuthController } from './auth.controller.js';

const FRONTEND_URL = process.env.FRONTEND_URL || "https://assign-4-l2b6-sb-frontend.vercel.app";

const router = express.Router();

router.get("/me", checkAuth(), AuthController.getMe);

// ✅ Session exchange endpoint
router.get("/session-exchange", async (req: Request, res: Response) => {
    try {
        const token = (req.headers["x-session-token"] || req.query.token) as string;

        if (!token) {
            res.status(401).json({ error: "No token provided" });
            return;
        }

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
            token: token,
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

// ✅ Intercept the Google OAuth callback to inject token into redirect URL
// This wraps the catch-all handler and modifies the response for /callback routes
router.use(async (req: Request, res: Response) => {
    const isCallback = req.path.includes("/callback");

    if (!isCallback) {
        return toNodeHandler(auth)(req, res);
    }

    // Intercept the response for callback routes
    const originalWriteHead = res.writeHead.bind(res);
    const originalRedirect = res.redirect.bind(res);

    // Override redirect to inject token
    (res as any).redirect = function (url: string) {
        try {
            // Extract Set-Cookie header that better-auth set
            const setCookieHeader = res.getHeader("set-cookie");
            const cookies = Array.isArray(setCookieHeader)
                ? setCookieHeader
                : [setCookieHeader as string].filter(Boolean);

            let token: string | null = null;

            for (const cookie of cookies) {
                if (!cookie) continue;
                const match = cookie.match(/(?:__Secure-)?better-auth\.session_token=([^;]+)/);
                if (match?.[1]) {
                    token = match[1];
                    break;
                }
            }

            // If we found a token and it's going to the bridge, append token
            if (token && url.includes("/auth/bridge")) {
                const separator = url.includes("?") ? "&" : "?";
                url = `${url}${separator}token=${encodeURIComponent(token)}`;
            }
        } catch (e) {
            // If anything fails, just redirect normally
        }

        return originalRedirect(url);
    };

    return toNodeHandler(auth)(req, res);
});

export const AuthRoutes = router;