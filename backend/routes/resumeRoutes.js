import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';
import { uploadResume, getRecommendations } from '../controllers/resumeController.js';

const router = express.Router();

// Configure Multer for memory storage (up to 10MB)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'text/plain', 'application/octet-stream'];
    if (allowed.includes(file.mimetype) || file.originalname.match(/\.(pdf|txt)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and TXT files are allowed'));
    }
  }
});

// Routes
router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/recommendations', protect, getRecommendations);

export default router;
