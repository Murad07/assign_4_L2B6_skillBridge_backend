import { betterAuth } from 'better-auth';
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "https://assign-4-l2b6-sb-frontend.vercel.app";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        },
    },
    secret: process.env.BETTER_AUTH_SECRET || process.env.JWT_SECRET,
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: "Student",
                input: true,
            },
        },
    },
    trustedOrigins: [
        FRONTEND_URL,
        "http://localhost:3000",
    ],
    advanced: {
        defaultCookieAttributes: {
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production",
        },
    },
});