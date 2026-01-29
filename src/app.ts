import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import config from './config';
import routes from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import { AuthRoutes } from './app/modules/auth/auth.route';

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
app.use('/api', routes);

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