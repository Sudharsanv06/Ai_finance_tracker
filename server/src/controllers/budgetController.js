import Budget from '../models/Budget.js';

// @desc    Get all budgets for logged-in user
// @route   GET /api/budgets
// @access  Private
export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id }).sort({ year: -1, month: -1 });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single budget
// @route   GET /api/budgets/:id
// @access  Private
export const getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new budget
// @route   POST /api/budgets
// @access  Private
export const createBudget = async (req, res) => {
  try {
    const { month, year, totalLimit, categoryLimits } = req.body;

    // Check if budget already exists for this month/year
    const existingBudget = await Budget.findOne({
      user: req.user._id,
      month,
      year,
    });

    if (existingBudget) {
      return res.status(400).json({ message: 'Budget already exists for this period' });
    }

    const budget = await Budget.create({
      user: req.user._id,
      month,
      year,
      totalLimit,
      categoryLimits: categoryLimits || [],
    });

    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private
export const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(budget, req.body);
    const updatedBudget = await budget.save();

    res.json(updatedBudget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current month budget
// @route   GET /api/budgets/current
// @access  Private
export const getCurrentBudget = async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
    const currentYear = now.getFullYear();

    const budget = await Budget.findOne({
      user: req.user._id,
      month: currentMonth,
      year: currentYear,
    });

    if (!budget) {
      return res.status(404).json({ message: 'No budget set for current month' });
    }

    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await budget.deleteOne();
    res.json({ message: 'Budget removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
