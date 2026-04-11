import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from '../../lib/auth.js'

export enum UserRole {
    STUDENT = "Student",
    TUTOR = "Tutor",
    ADMIN = "Admin",
    MANAGER = "Manager",
    MODERATOR = "Moderator"
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name: string;
                role: string;
                emailVerified: boolean;
            }
        }
    }
}

const auth = (...roles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const incomingCookie = req.headers["cookie"] || "";

            const tokenMatch = incomingCookie.match(
                /(?:__Secure-)?better-auth\.session_token=([^;]+)/
            );
            const rawTokenValue = tokenMatch?.[1];

            const bearerToken = (req.headers["authorization"] || "")
                .replace("Bearer ", "")
                .trim();

            // ✅ Decode whichever token we found — this is the key fix
            const resolvedToken = rawTokenValue
                ? decodeURIComponent(rawTokenValue)
                : bearerToken
                    ? decodeURIComponent(bearerToken)
                    : null;

            if (!resolvedToken) {
                return res.status(401).json({
                    success: false,
                    message: "You are not authorized!",
                });
            }

            // ✅ Pass decoded token under both cookie names
            const headers = new Headers();
            headers.set(
                "cookie",
                `better-auth.session_token=${resolvedToken}; __Secure-better-auth.session_token=${resolvedToken}`
            );

            const session = await betterAuth.api.getSession({ headers });

            if (!session) {
                return res.status(401).json({
                    success: false,
                    message: "You are not authorized!",
                });
            }

            req.user = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                role: session.user.role as string,
                emailVerified: session.user.emailVerified,
            };

            if (roles.length && !roles.includes(req.user.role as UserRole)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden! You don't have permission to access this resource!",
                });
            }

            next();
        } catch (err) {
            next(err);
        }
    };
};

export default auth;