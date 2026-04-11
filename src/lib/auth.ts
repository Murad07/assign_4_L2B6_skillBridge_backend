import { betterAuth } from 'better-auth';
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";

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
        process.env.FRONTEND_URL || "https://assign-4-l2b6-sb-frontend.vercel.app",
        "http://localhost:3000",
    ],
    advanced: {
        defaultCookieAttributes: {
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production",
        },
        // ✅ This tells better-auth to accept the token from the Authorization header
        // so our Next.js API route can validate sessions without relying on cookie forwarding
        useSecureCookies: process.env.NODE_ENV === "production",
    },
});