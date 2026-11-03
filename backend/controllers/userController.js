import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get logged in user profile
export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { 
        clubMemberships: { include: { club: true } }, 
        bookings: { include: { auditorium: { select: { name: true } } } }
      }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Remove password before sending
    const { password, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching profile' });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { name, department, year, skills, bio, avatar } = req.body;
    
    // Create an update object, only including defined fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (department !== undefined) updateData.department = department;
    if (year !== undefined) updateData.year = year;
    if (skills !== undefined) updateData.skills = skills;
    if (bio !== undefined) updateData.bio = bio;
    if (avatar !== undefined) updateData.avatar = avatar;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
    });
    
    const { password, ...userWithoutPassword } = updatedUser;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: 'Server error updating profile' });
  }
};

// Get Top 10 Leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const topUsers = await prisma.user.findMany({
      orderBy: { points: 'desc' },
      take: 10,
      select: {
        id: true,
        name: true,
        department: true,
        avatar: true,
        points: true,
        role: true
      }
    });
    res.status(200).json(topUsers);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching leaderboard' });
  }
};
