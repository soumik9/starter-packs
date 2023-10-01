import express from 'express'
const router = express.Router();

import signin from '../controllers/auth/signin.js';
import signup from '../controllers/auth/signup.js';
import profile from '../controllers/auth/profile.js';

import auth from '../middleware/auth.js';

//routes
router.get('/profile', auth(), profile);
router.post('/signin', signin);
router.post('/signup', signup);

export default router;