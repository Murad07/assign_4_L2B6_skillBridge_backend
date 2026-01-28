import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { CategoryRouter } from '../modules/category/category.route';
import { TutorRouter } from '../modules/tutor/tutor.route';

const router = Router();

const moduleRoutes = [
    {
        path: '/auth',
        route: AuthRoutes,
    },
    {
        path: '/category',
        route: CategoryRouter
    },
    {
        path: '/tutor',
        route: TutorRouter
    }
];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;