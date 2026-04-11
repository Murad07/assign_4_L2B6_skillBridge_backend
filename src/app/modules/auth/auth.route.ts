import express, { Request, Response } from 'express';
import { auth } from '../../../lib/auth.js';
import { toNodeHandler } from "better-auth/node";
import { AuthValidation } from './auth.validation.js';
import validateRequest from '../../middlewares/validateRequest.js';
import checkAuth from '../../middlewares/auth.js';
import { AuthController } from './auth.controller.js';

const FRONTEND_URL = process.env.FRONTEND_URL || "https://assign-4-l2b6-sb-frontend.vercel.app";
const BACKEND_URL = process.env.BETTER_AUTH_URL || "https://assign-4-l2-b6-skill-bridge-backend.vercel.app";

const router = express.Router();

router.get("/me", checkAuth(), AuthController.getMe);

// ✅ Session exchange — validates token and returns user info
router.get("/session-exchange", async (req: Request, res: Response) => {
    try {
        const rawToken = (req.headers["x-session-token"] || req.query.token) as string;

        if (!rawToken) {
            res.status(401).json({ error: "No token provided" });
            return;
        }

        const decodedToken = decodeURIComponent(rawToken);

        console.log("session-exchange: token received:", decodedToken.slice(0, 20) + "...");

        const sessionRes = await fetch(`${BACKEND_URL}/api/auth/get-session`, {
            method: "GET",
            headers: {
                "Cookie": `better-auth.session_token=${decodedToken}`,
                "Content-Type": "application/json",
                "Origin": BACKEND_URL,  // ✅ must match trustedOrigins
            },
        });

        const text = await sessionRes.text();
        console.log("get-session status:", sessionRes.status, "body:", text);

        if (!text || !text.startsWith("{")) {
            res.status(401).json({ error: "Empty or invalid response from get-session", status: sessionRes.status });
            return;
        }

        let data: any;
        try {
            data = JSON.parse(text);
        } catch (e) {
            res.status(500).json({ error: "Invalid JSON from get-session", raw: text });
            return;
        }

        if (!data?.user) {
            res.status(401).json({ error: "Invalid or expired session", detail: data });
            return;
        }

        res.json({
            success: true,
            user: data.user,
            session: data.session,
            token: decodedToken,
        });
    } catch (err: any) {
        console.error("session-exchange error:", err);
        res.status(500).json({ error: err.message || "Session exchange failed" });
    }
});

router.all(
    "/sign-up/email",
    validateRequest(AuthValidation.registrationSchema),
    toNodeHandler(auth)
);

// ✅ Catch-all: intercepts Google OAuth callback to inject token into redirect URL
router.use(async (req: Request, res: Response) => {
    const isCallback = req.path.includes("/callback");

    if (!isCallback) {
        return toNodeHandler(auth)(req, res);
    }

    const originalWriteHead = res.writeHead.bind(res);

    // @ts-ignore
    res.writeHead = function (statusCode: number, headers?: any) {
        try {
            if (statusCode === 302 || statusCode === 301) {
                let location: string =
                    (headers?.location || headers?.Location || "") as string;

                if (!location) {
                    location = (res.getHeader("location") || res.getHeader("Location") || "") as string;
                }

                const setCookieHeader = res.getHeader("set-cookie");
                const cookies: string[] = Array.isArray(setCookieHeader)
                    ? setCookieHeader as string[]
                    : [setCookieHeader as string].filter(Boolean);

                let token: string | null = null;
                for (const cookie of cookies) {
                    if (!cookie) continue;
                    const match = cookie.match(
                        /(?:__Secure-)?better-auth\.session_token=([^;]+)/
                    );
                    if (match?.[1]) {
                        token = decodeURIComponent(match[1]);
                        break;
                    }
                }

                console.log("callback writeHead — location:", location, "token found:", !!token);

                if (token && location.includes("/auth/bridge")) {
                    const separator = location.includes("?") ? "&" : "?";
                    const newLocation = `${location}${separator}token=${encodeURIComponent(token)}`;

                    if (headers && typeof headers === "object") {
                        headers.location = newLocation;
                        headers.Location = newLocation;
                    } else {
                        res.setHeader("Location", newLocation);
                    }

                    console.log("callback writeHead — new location:", newLocation);
                }
            }
        } catch (e) {
            console.error("writeHead intercept error:", e);
        }

        return originalWriteHead(statusCode, headers);
    };

    return toNodeHandler(auth)(req, res);
});

export const AuthRoutes = router;