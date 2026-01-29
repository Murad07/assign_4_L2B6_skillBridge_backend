import app from '../src/app';

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
// An Express `app` is itself a request handler, so we can export it directly.
export default app;
