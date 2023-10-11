import express from 'express';
const router = express.Router();

import authRouter from './authRouter'


const apiRoutes: { path: string, route: any }[] = [
    {
        path: '/',
        route: authRouter,
    },
];

apiRoutes.forEach(route => router.use(route.path, route.route));
export default router;