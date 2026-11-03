import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        club: true,
        _count: { select: { registrations: true } }
      },
      orderBy: { date: 'asc' }
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching events' });
  }
};

// Get single event
export const getEventById = async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: {
        club: true,
        _count: { select: { registrations: true } }
      }
    });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching event' });
  }
};

// Create event
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, posters, venue, capacity, clubId } = req.body;
    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        posters,
        venue,
        capacity: parseInt(capacity) || 100,
        clubId
      }
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Server error creating event' });
  }
};

// Get Open Positions (mocked if not used, but exported for routes)
export const getOpenPositions = async (req, res) => {
  res.json([]);
};

// Register for event
export const registerForEvent = async (req, res) => {
  try {
    let reg = await prisma.eventRegistration.findFirst({
      where: { userId: req.user.id, eventId: req.params.id }
    });
    
    if (reg) {
      if (!reg.qrData) {
         const qrData = `TICKET-EV-${req.params.id}-USR-${req.user.id}`;
         reg = await prisma.eventRegistration.update({
            where: { id: reg.id },
            data: { qrData }
         });
      }
      return res.status(200).json(reg);
    }

    const qrData = `TICKET-EV-${req.params.id}-USR-${req.user.id}`;
    reg = await prisma.eventRegistration.create({
      data: { userId: req.user.id, eventId: req.params.id, qrData }
    });

    // Award 50 points to the user for registering
    await prisma.user.update({
      where: { id: req.user.id },
      data: { points: { increment: 50 } }
    });

    res.status(201).json(reg);
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: 'Server error registering for event' });
  }
};

// Get user ticket
export const getTicket = async (req, res) => {
  try {
    const reg = await prisma.eventRegistration.findFirst({
      where: { userId: req.user.id, eventId: req.params.id }
    });
    
    if (reg && reg.qrData) {
      return res.status(200).json({ qrData: reg.qrData });
    }
    return res.status(404).json({ error: 'Ticket not found' });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching ticket' });
  }
};

// AI feature: Generate promotional announcement
export const generateAnnouncement = async (req, res) => {
  try {
    const event = await prisma.event.findUnique({ where: { id: req.params.id }, include: { club: true } });
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const announcement = `🚀 *Get ready for ${event.title}!* 🚀\n\n${event.club.name} is thrilled to announce our upcoming event on ${new Date(event.date).toLocaleDateString()}.\n\n🎯 What to expect:\n${event.description}\n\n📍 Venue: ${event.venue}\n🔥 Only ${event.capacity} seats available!\n\nDon't miss out on this amazing opportunity to learn and connect. Register now on SmartCampus! \n\n#${event.club.name.replace(/\s+/g, '')} #${event.title.replace(/\s+/g, '')} #SmartCampus #TechLife`;
    
    res.json({ announcement });
  } catch (error) {
    res.status(500).json({ error: 'Server error generating announcement' });
  }
};
