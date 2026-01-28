import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { CategoryRouter } from '../modules/category/category.route';
import { TutorRouter } from '../modules/tutor/tutor.route';
import { BookingRoutes } from '../modules/booking/booking.route'; // Import BookingRoutes
import { ReviewRoutes } from '../modules/review/review.route';
import { UserRoutes } from '../modules/user/user.route';

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
    },
    {
        path: '/bookings', // New path for booking routes
        route: BookingRoutes
    },
    {
        path: '/reviews',
        route: ReviewRoutes,
    }
    ,
    {
        path: '/admin/users',
        route: UserRoutes,
    }
];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;