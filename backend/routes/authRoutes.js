import express from 'express';
import { register, login, getUsers } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route: POST /api/auth/register
router.post('/register', register);

// Route: POST /api/auth/login
router.post('/login', login);

// Route: GET /api/auth/users
router.get('/users', protect, getUsers);

export default router;
