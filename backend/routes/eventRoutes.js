import express from 'express';
import { getAllEvents, createEvent, getOpenPositions, registerForEvent, getEventById, generateAnnouncement, getTicket } from '../controllers/eventController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAllEvents)
  .post(protect, authorize('CLUB_ADMIN', 'FACULTY', 'SUPER_ADMIN'), createEvent);

router.route('/positions')
  .get(getOpenPositions);

router.route('/:id')
  .get(getEventById);

router.route('/:id/register')
  .post(protect, registerForEvent);

router.route('/:id/ticket')
  .get(protect, getTicket);

router.route('/:id/announce')
  .post(protect, authorize('CLUB_ADMIN', 'SUPER_ADMIN', 'FACULTY'), generateAnnouncement);

export default router;
