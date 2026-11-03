import express from 'express';
import { getClubs, getClubById, createClub, updateClub, joinClub, getPendingRequests, approveRequest } from '../controllers/clubController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getClubs)
  .post(protect, authorize('SUPER_ADMIN', 'FACULTY'), createClub);

router.route('/:id')
  .get(getClubById)
  .put(protect, authorize('SUPER_ADMIN', 'CLUB_ADMIN', 'FACULTY'), updateClub);

router.route('/:id/join')
  .post(protect, joinClub);

router.route('/requests/pending')
  .get(protect, authorize('SUPER_ADMIN', 'FACULTY', 'CLUB_ADMIN'), getPendingRequests);

router.route('/requests/:requestId')
  .put(protect, authorize('SUPER_ADMIN', 'FACULTY', 'CLUB_ADMIN'), approveRequest);

export default router;
