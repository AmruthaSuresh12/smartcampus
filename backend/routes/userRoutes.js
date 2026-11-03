import express from 'express';
import { getProfile, updateProfile, getLeaderboard } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);

router.get('/leaderboard', protect, getLeaderboard);

export default router;
