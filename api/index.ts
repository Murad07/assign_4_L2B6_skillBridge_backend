
import type { Request, Response } from 'express';
import app from '../src/app';
import { prisma } from '../src/lib/prisma';

// Sanity-check required environment variables early so the error is clear in logs
const requiredEnv = ['DATABASE_URL'];
const missing = requiredEnv.filter((k) => !process.env[k]);
if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

// Catch and log unexpected rejections to help debugging in serverless logs
process.on('unhandledRejection', (reason) => {
    // eslint-disable-next-line no-console
    console.error('Unhandled Rejection in serverless function:', reason);
});

process.on('uncaughtException', (err) => {
    // eslint-disable-next-line no-console
    console.error('Uncaught Exception in serverless function:', err);
});

// Vercel's Node runtime expects a default export function (req, res).
// We wrap the Express app in a handler function to ensure the database
// is connected before processing requests.
export default async function handler(req: Request, res: Response) {
    try {
        await prisma.$connect();
        // console.log('Connected to the database successfully.');
        return app(req, res);
    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
        // console.log('Disconnected from the database.');
    }
}

