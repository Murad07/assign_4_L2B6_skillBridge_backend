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
            // get user session
            const session = await betterAuth.api.getSession({
                headers: req.headers as any
            })

            if (!session) {
                console.warn("Auth Middleware — No session found!");
                console.log("Incoming Headers:", JSON.stringify(req.headers, null, 2));
                return res.status(401).json({
                    success: false,
                    message: "You are not authorized!"
                })
            }

            // if (!session.user.emailVerified) {
            //     return res.status(403).json({
            //         success: false,
            //         message: "Email verification required. Please verfiy your email!"
            //     })
            // }

            console.log("Auth Middleware — User Role:", session.user.role);
            console.log("Auth Middleware — Required Roles:", roles);

            req.user = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                role: session.user.role as string,
                emailVerified: session.user.emailVerified
            }


            if (roles.length && !roles.includes(req.user.role as UserRole)) {
                console.warn(`Access Denied: User role '${req.user.role}' not in required list:`, roles);
                return res.status(403).json({
                    success: false,
                    message: "Forbidden! You don't have permission to access this resources!"
                })
            }

            next()
        } catch (err) {
            next(err);
        }

    }
};

export default auth;