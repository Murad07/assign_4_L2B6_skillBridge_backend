import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import config from './config/index.js';
// routes will be dynamically imported below to avoid loading heavy modules on cold start
import globalErrorHandler from './app/middlewares/globalErrorHandler.js';
import notFound from './app/middlewares/notFound.js';
import router from './app/routes/index.js';

const app: Application = express();

// Trust proxy is required for secure cookies (https) when deployed behind a proxy (like Vercel/Render/Heroku)
app.set('trust proxy', 1);

// Middlewares
app.use(
    cors({
        origin: config.node_env === 'development'
            ? config.frontend_url
            : process.env.FRONTEND_URL,
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Application routes
app.use('/api', router);

// Health check route
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to SkillBridge API',
        version: '1.0.0',
    });
});

// Global error handler
app.use(globalErrorHandler);

// Not found handler (404)
app.use(notFound);

export default app;