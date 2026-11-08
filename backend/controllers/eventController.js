import { PrismaClient } from '@prisma/client';
import ExcelJS from 'exceljs';

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
    const body = req.body || {};
    const studentName = typeof body.name === 'string' ? body.name.trim() : '';
    const usn = typeof body.usn === 'string' ? body.usn.trim() : '';
    const motivation = typeof body.motivation === 'string' ? body.motivation.trim() : '';

    if (!studentName || !usn || !motivation) {
      return res.status(400).json({ error: 'Name, USN, and motivation are required.' });
    }

    if (studentName.length > 120 || usn.length > 30 || motivation.length > 2000) {
      return res.status(400).json({ error: 'Registration details exceed the allowed length.' });
    }

    let reg = await prisma.eventRegistration.findFirst({
      where: { userId: req.user.id, eventId: req.params.id }
    });
    
    if (reg) {
      const qrData = reg.qrData || `TICKET-EV-${req.params.id}-USR-${req.user.id}`;
      reg = await prisma.eventRegistration.update({
        where: { id: reg.id },
        data: { studentName, usn, motivation, qrData }
      });
      return res.status(200).json(reg);
    }

    const qrData = `TICKET-EV-${req.params.id}-USR-${req.user.id}`;
    reg = await prisma.eventRegistration.create({
      data: { userId: req.user.id, eventId: req.params.id, studentName, usn, motivation, qrData }
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

export const exportEventRegistrations = async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: {
        club: { select: { name: true } },
        registrations: {
          orderBy: { createdAt: 'asc' },
          include: {
            user: {
              select: { name: true, email: true, department: true, year: true }
            }
          }
        }
      }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Registrations');
    worksheet.mergeCells('A1:I1');
    worksheet.getCell('A1').value = event.title;
    worksheet.getCell('A1').font = { bold: true, size: 16 };
    worksheet.getCell('A2').value = 'Club';
    worksheet.getCell('B2').value = event.club.name;
    worksheet.getCell('A3').value = 'Event date';
    worksheet.getCell('B3').value = event.date;
    worksheet.getCell('B3').numFmt = 'yyyy-mm-dd hh:mm';
    worksheet.addRow([]);
    worksheet.addRow([
      'Student name',
      'Email',
      'USN',
      'Department',
      'Year',
      'Motivation',
      'Registration status',
      'Attended',
      'Registered at'
    ]);

    const headerRow = worksheet.getRow(5);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF334155' }
    };

    for (const registration of event.registrations) {
      worksheet.addRow([
        registration.studentName || registration.user.name,
        registration.user.email,
        registration.usn || '',
        registration.user.department || '',
        registration.user.year ?? '',
        registration.motivation || '',
        registration.status,
        registration.attended ? 'Yes' : 'No',
        registration.createdAt
      ]);
    }

    worksheet.columns = [
      { width: 24 },
      { width: 32 },
      { width: 18 },
      { width: 20 },
      { width: 10 },
      { width: 50 },
      { width: 22 },
      { width: 12 },
      { width: 22 }
    ];
    worksheet.getColumn(9).numFmt = 'yyyy-mm-dd hh:mm';
    worksheet.views = [{ state: 'frozen', ySplit: 5 }];
    worksheet.autoFilter = { from: 'A5', to: 'I5' };

    const file = await workbook.xlsx.writeBuffer();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="event-${event.id}-registrations.xlsx"`);
    res.send(Buffer.from(file));
  } catch (error) {
    console.error('Export event registrations error:', error);
    res.status(500).json({ error: 'Server error exporting event registrations' });
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
