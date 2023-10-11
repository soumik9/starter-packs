import express from 'express'
const router = express.Router();

import profile from '../controllers/auth/profile';
import signin from '../controllers/auth/signin';
import signup from '../controllers/auth/signup';

import auth from '../middleware/auth'
import upload from '../middleware/upload'
import permission from '../middleware/permission';
import { ENUM_USER_ROLE, userCreate } from '../../utils/constants/constants';


//routes
router.post('/signin', signin);
router.post(
    '/signup',
    auth(ENUM_USER_ROLE.ADMIN),
    // permission(userCreate),
    upload.single('image'),
    signup
);
router.get(
    '/profile',
    auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CUSTOMER, ENUM_USER_ROLE.SUPPLIER),
    profile
);

export default router;