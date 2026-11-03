import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'smartcampus_nie_secret_key_2026';
    const decoded = jwt.verify(token, secret);
    req.user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true, email: true }
    });

    if (!req.user) {
      return res.status(401).json({ error: 'Not authorized, user not found' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Not authorized, token failed' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: `User role ${req.user.role} is not authorized` });
    }
    next();
  };
};
