import Expense from '../models/Expense.js';
import Insight from '../models/Insight.js';
import aiClient from '../utils/aiClient.js';

// @desc    Categorize expense using AI
// @route   POST /api/ai/categorize
// @access  Private
export const categorizeExpense = async (req, res) => {
  try {
    const { description, amount } = req.body;

    if (!description || !amount) {
      return res.status(400).json({ message: 'Description and amount are required' });
    }

    const category = await aiClient.categorizeExpense(description, amount);

    res.json({
      category,
      notes: `AI suggested category based on description`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate AI insights for user
// @route   POST /api/ai/insights
// @access  Private
export const generateInsights = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const period = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;

    // Get expenses for current month
    const expenses = await Expense.find({
      user: req.user._id,
      date: {
        $gte: new Date(currentYear, currentMonth - 1, 1),
        $lt: new Date(currentYear, currentMonth, 1),
      },
    });

    // Calculate category totals
    const categoryTotals = {};
    let total = 0;

    expenses.forEach((expense) => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
      total += expense.amount;
    });

    const summaryData = {
      month: period,
      total,
      byCategory: categoryTotals,
      transactionCount: expenses.length,
    };

    // Generate AI insight
    const aiText = await aiClient.generateInsight(summaryData);

    // Save insight
    const insight = await Insight.create({
      user: req.user._id,
      period,
      type: 'summary',
      data: summaryData,
      aiText,
    });

    res.status(201).json(insight);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all insights for user
// @route   GET /api/ai/insights
// @access  Private
export const getInsights = async (req, res) => {
  try {
    const insights = await Insight.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(insights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Ask AI a question about spending
// @route   POST /api/ai/ask
// @access  Private
export const askQuestion = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }

    // Get recent expenses
    const expenses = await Expense.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(100);

    const transactionsJson = JSON.stringify(
      expenses.map((e) => ({
        date: e.date,
        description: e.description,
        amount: e.amount,
        category: e.category,
      }))
    );

    const answer = await aiClient.answerQuestion(question, transactionsJson);

    res.json({ question, answer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
