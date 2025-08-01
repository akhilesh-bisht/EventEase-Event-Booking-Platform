import { Router } from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/auth.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = Router();

// Register new user
router.post('/signup', registerUser);

// Login user
router.post('/login', loginUser);

// Logout user (protected route)
router.post('/logout', isAuthenticated, logoutUser);

export default router;
