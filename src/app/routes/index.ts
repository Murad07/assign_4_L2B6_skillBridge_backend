import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { CategoryRouter } from '../modules/category/category.route';

const router = Router();

const moduleRoutes = [
    {
        path: '/auth',
        route: AuthRoutes,
    },
    {
        path: '/category',
        route: CategoryRouter
    }
];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;