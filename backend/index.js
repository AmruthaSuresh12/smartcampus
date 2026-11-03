import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import clubRoutes from './routes/clubRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5005;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Health Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Smart Campus API is running!' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/resume', resumeRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Keep event loop alive (workaround for Node 24 early exit bug)
setInterval(() => {}, 1000 * 60 * 60);
