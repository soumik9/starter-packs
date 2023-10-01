import express from 'express';
const router = express.Router();

import authRouter from '../app/routers/authRouter.js'

const apiRoutes = [
    {
        path: '/auth',
        route: authRouter,
    },
];

apiRoutes.forEach(route => router.use(route.path, route.route));
export default router;