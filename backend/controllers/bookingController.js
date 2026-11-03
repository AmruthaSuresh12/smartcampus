import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all auditoriums with upcoming bookings
export const getAuditoriums = async (req, res) => {
  try {
    const auditoriums = await prisma.auditorium.findMany({
      include: {
        bookings: {
          where: { date: { gte: new Date() } },
          select: { id: true, date: true, timeSlot: true, status: true, user: { select: { name: true } } }
        }
      }
    });
    res.status(200).json(auditoriums);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching auditoriums' });
  }
};

// Get all bookings (Admin/Staff)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        auditorium: { select: { name: true } },
        user: { select: { name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching bookings' });
  }
};

// Create a new booking request
export const createBooking = async (req, res) => {
  try {
    const { date, timeSlot, reason, auditoriumId } = req.body;
    
    // Check for conflict
    const conflict = await prisma.booking.findFirst({
      where: {
        auditoriumId,
        date: new Date(date),
        timeSlot,
        status: { in: ['APPROVED', 'PENDING'] }
      }
    });

    if (conflict) {
      return res.status(400).json({ error: 'This time slot is already requested or booked.' });
    }

    const booking = await prisma.booking.create({
      data: {
        date: new Date(date),
        timeSlot,
        reason,
        auditoriumId,
        userId: req.user.id,
        status: 'PENDING'
      }
    });
    
    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error creating booking' });
  }
};

// Update booking status (Admin/Staff only)
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status }
    });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating booking' });
  }
};
