import express from 'express';
import { getAuditoriums, createBooking, updateBookingStatus, getAllBookings } from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/auditoriums').get(getAuditoriums);

router.route('/')
  .get(protect, authorize('SUPER_ADMIN', 'FACULTY'), getAllBookings)
  .post(protect, createBooking);

router.route('/:id/status')
  .put(protect, authorize('SUPER_ADMIN', 'FACULTY'), updateBookingStatus);

export default router;
