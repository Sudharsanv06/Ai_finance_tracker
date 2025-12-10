import express from 'express';
import {
  categorizeExpense,
  generateInsights,
  getInsights,
  askQuestion,
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/categorize', protect, categorizeExpense);
router.route('/insights').get(protect, getInsights).post(protect, generateInsights);
router.post('/ask', protect, askQuestion);

export default router;
