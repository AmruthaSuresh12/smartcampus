import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Get all clubs
export const getClubs = async (req, res) => {
  try {
    const clubs = await prisma.club.findMany({
      include: { 
        facultyCoordinator: { select: { name: true } }, 
        _count: { select: { members: true } } 
      }
    });
    res.status(200).json(clubs);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching clubs' });
  }
};

// Get single club
export const getClubById = async (req, res) => {
  try {
    const club = await prisma.club.findUnique({
      where: { id: req.params.id },
      include: { 
        facultyCoordinator: { select: { name: true, email: true } },
        members: { include: { user: { select: { id: true, name: true, role: true, avatar: true } } } },
        events: true,
        openings: true
      }
    });
    if (!club) return res.status(404).json({ error: 'Club not found' });
    res.status(200).json(club);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching club' });
  }
};

// Create a new club (Super Admin / Faculty)
export const createClub = async (req, res) => {
  try {
    const { name, description, logo, banner, facultyCoordinatorId } = req.body;
    const newClub = await prisma.club.create({
      data: { name, description, logo, banner, facultyCoordinatorId }
    });
    res.status(201).json(newClub);
  } catch (error) {
    res.status(500).json({ error: 'Server error creating club' });
  }
};

// Update club
export const updateClub = async (req, res) => {
  try {
    const { name, description, logo, banner } = req.body;
    const updatedClub = await prisma.club.update({
      where: { id: req.params.id },
      data: { name, description, logo, banner }
    });
    res.status(200).json(updatedClub);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating club' });
  }
};

// Join a club (creates pending request)
export const joinClub = async (req, res) => {
  try {
    const existing = await prisma.clubMember.findUnique({
      where: { userId_clubId: { userId: req.user.id, clubId: req.params.id } }
    });
    if (existing) return res.status(400).json({ error: 'Already requested or joined' });

    const member = await prisma.clubMember.create({
      data: { userId: req.user.id, clubId: req.params.id, status: 'PENDING' }
    });
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: 'Server error joining club' });
  }
};

// Get pending club requests (Admin/Faculty)
export const getPendingRequests = async (req, res) => {
  try {
    const requests = await prisma.clubMember.findMany({
      where: { status: 'PENDING' },
      include: {
        user: { select: { name: true, email: true } },
        club: { select: { name: true } }
      }
    });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching requests' });
  }
};

// Approve club request
export const approveRequest = async (req, res) => {
  try {
    const { status } = req.body; // 'APPROVED' or 'REJECTED'
    const updated = await prisma.clubMember.update({
      where: { id: req.params.requestId },
      data: { status }
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Server error approving request' });
  }
};
