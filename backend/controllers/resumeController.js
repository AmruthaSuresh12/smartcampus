import { PrismaClient } from '@prisma/client';
import { parsePdfBuffer, extractSkillsFromText, matchClubsForSkills } from '../services/resumeService.js';

const prisma = new PrismaClient();

// Upload and analyze resume
export const uploadResume = async (req, res) => {
  try {
    let rawText = '';

    if (req.file) {
      if (req.file.mimetype === 'application/pdf' || req.file.originalname.toLowerCase().endsWith('.pdf')) {
        rawText = await parsePdfBuffer(req.file.buffer);
      } else {
        // Plain text file
        rawText = req.file.buffer.toString('utf-8');
      }
    } else if (req.body.resumeText) {
      rawText = req.body.resumeText;
    } else {
      return res.status(400).json({ error: 'Please upload a PDF or text resume file.' });
    }

    if (!rawText || rawText.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract text from the uploaded file. Please make sure the PDF has selectable text.' });
    }

    // Extract skills
    const extractedSkills = extractSkillsFromText(rawText);

    if (extractedSkills.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Resume parsed, but no standard tech keywords were identified. You can add skills manually to your profile.',
        skills: [],
        recommendations: await matchClubsForSkills([])
      });
    }

    // Upsert Resume model in database
    await prisma.resume.upsert({
      where: { userId: req.user.id },
      create: {
        userId: req.user.id,
        techTags: JSON.stringify(extractedSkills)
      },
      update: {
        techTags: JSON.stringify(extractedSkills)
      }
    });

    // Also update User profile skills
    const existingUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { skills: true }
    });

    const currentSkills = existingUser?.skills
      ? existingUser.skills.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const mergedSkills = Array.from(new Set([...currentSkills, ...extractedSkills]));

    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        skills: mergedSkills.join(', ')
      }
    });

    // Get recommendations
    const recommendations = await matchClubsForSkills(mergedSkills);

    res.status(200).json({
      success: true,
      message: `Extracted ${extractedSkills.length} skills successfully!`,
      skills: mergedSkills,
      newlyExtracted: extractedSkills,
      recommendations
    });
  } catch (error) {
    console.error('Error processing resume upload:', error);
    res.status(500).json({ error: 'Failed to process resume: ' + error.message });
  }
};

// Get current recommendations based on stored skills or resume
export const getRecommendations = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { resume: true }
    });

    let skills = [];
    if (user?.resume?.techTags) {
      try {
        skills = JSON.parse(user.resume.techTags);
      } catch (_) {}
    }

    if (skills.length === 0 && user?.skills) {
      skills = user.skills.split(',').map(s => s.trim()).filter(Boolean);
    }

    const recommendations = await matchClubsForSkills(skills);

    res.status(200).json({
      success: true,
      skills,
      hasResume: !!user?.resume,
      recommendations
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
};
