import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import config from './config/index.js';
// routes will be dynamically imported below to avoid loading heavy modules on cold start
import globalErrorHandler from './app/middlewares/globalErrorHandler.js';
import notFound from './app/middlewares/notFound.js';
import { AuthRoutes } from './app/modules/auth/auth.route.js';

const app: Application = express();

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
// Dynamically import routes so the root health-check can respond without loading
// all controllers/services (which reduces cold-start latency).
import('./app/routes/index.js')
    .then((m) => {
        app.use('/api', m.default);
    })
    .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Failed to load routes:', err);
    });

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