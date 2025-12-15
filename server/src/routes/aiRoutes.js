import express from 'express';
import {
  categorizeExpense,
  generateInsights,
  getInsights,
  askQuestion,
  predictBudget,
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/categorize', protect, categorizeExpense);
router.route('/insights').get(protect, getInsights).post(protect, generateInsights);
router.post('/ask', protect, askQuestion);
router.post('/predict', protect, predictBudget);

export default router;
