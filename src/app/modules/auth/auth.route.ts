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

        const backendUrl = process.env.BETTER_AUTH_URL ||
            "https://assign-4-l2-b6-skill-bridge-backend.vercel.app";

        // ✅ Decode token in case it came URL-encoded
        const decodedToken = decodeURIComponent(token);

        const fakeRequest = new Request(
            `${backendUrl}/api/auth/get-session`,
            {
                method: "GET",
                headers: new Headers({
                    "Cookie": `better-auth.session_token=${decodedToken}`,
                    "Content-Type": "application/json",
                    // ✅ better-auth needs the origin to validate the request
                    "Origin": backendUrl,
                    "Host": new URL(backendUrl).host,
                }),
            }
        );

        const sessionRes = await auth.handler(fakeRequest);

        // ✅ Check if response has a body before parsing
        const text = await sessionRes.text();
        console.log("session-exchange raw response:", text, "status:", sessionRes.status);

        if (!text) {
            res.status(401).json({ error: "Empty response from auth handler" });
            return;
        }

        let data: any;
        try {
            data = JSON.parse(text);
        } catch (e) {
            res.status(500).json({ error: "Invalid JSON from auth handler", raw: text });
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
        res.status(500).json({ error: err.message || "Session exchange failed" });
    }
});

router.all(
    "/sign-up/email",
    validateRequest(AuthValidation.registrationSchema),
    toNodeHandler(auth)
);

// ✅ Intercept the Google OAuth callback to inject token into redirect URL
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
                // Get location from the headers being written
                let location: string =
                    (headers?.location || headers?.Location || "") as string;

                if (!location) {
                    // Fall back to already-set header
                    location = (res.getHeader("location") || res.getHeader("Location") || "") as string;
                }

                // Extract token from Set-Cookie already set on res
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

                if (token && location.includes("/auth/bridge")) {
                    const separator = location.includes("?") ? "&" : "?";
                    const newLocation = `${location}${separator}token=${encodeURIComponent(token)}`;

                    // Patch the location in headers
                    if (headers && typeof headers === "object") {
                        headers.location = newLocation;
                        headers.Location = newLocation;
                    } else {
                        res.setHeader("Location", newLocation);
                    }
                }
            }
        } catch (e) {
            // Never break the response, just continue
            console.error("writeHead intercept error:", e);
        }

        return originalWriteHead(statusCode, headers);
    };

    return toNodeHandler(auth)(req, res);
});

export const AuthRoutes = router;