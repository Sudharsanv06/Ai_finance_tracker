import React, { useState, useEffect } from 'react';
import { getExpenses } from '../services/expenseService';
import { getBudgets } from '../services/budgetService';
import BudgetCard from '../components/BudgetCard';
import ExpensePieChart from '../components/Charts/ExpensePieChart';
import MonthlyBarChart from '../components/Charts/MonthlyBarChart';

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [expensesData, budgetsData] = await Promise.all([
        getExpenses(),
        getBudgets(),
      ]);
      setExpenses(expensesData);
      setBudgets(budgetsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCategoryData = () => {
    const categoryTotals = {};
    expenses.forEach((expense) => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });
    return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const currentBudget = budgets[0]?.totalLimit || 0;
  const remainingBudget = currentBudget - totalExpenses;
  const budgetUsedPercentage = currentBudget > 0 ? ((totalExpenses / currentBudget) * 100).toFixed(1) : 0;

  // Calculate monthly expenses (current month)
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const monthlyExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
  });
  const monthlyTotal = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  if (loading) {
    return <div style={styles.loading}>Loading dashboard...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>💰 Financial Dashboard</h1>
      
      <div style={styles.statsGrid}>
        <div style={{...styles.statCard, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
          <h3>Total Expenses</h3>
          <p style={styles.statValue}>₹{totalExpenses.toFixed(2)}</p>
          <small style={styles.statSubtext}>{expenses.length} transactions</small>
        </div>
        <div style={{...styles.statCard, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
          <h3>This Month</h3>
          <p style={styles.statValue}>₹{monthlyTotal.toFixed(2)}</p>
          <small style={styles.statSubtext}>{monthlyExpenses.length} transactions</small>
        </div>
        <div style={{...styles.statCard, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>
          <h3>Monthly Budget</h3>
          <p style={styles.statValue}>₹{currentBudget.toFixed(2)}</p>
          <small style={styles.statSubtext}>{budgetUsedPercentage}% used</small>
        </div>
        <div style={{...styles.statCard, background: remainingBudget >= 0 ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'}}>
          <h3>Remaining</h3>
          <p style={styles.statValue}>₹{Math.abs(remainingBudget).toFixed(2)}</p>
          <small style={styles.statSubtext}>{remainingBudget >= 0 ? 'Within budget' : 'Over budget!'}</small>
        </div>
      </div>

      <div style={styles.budgetSection}>
        <BudgetCard budget={currentBudget} spent={totalExpenses} />
      </div>

      <div style={styles.chartsGrid}>
        {expenses.length > 0 && (
          <>
            <ExpensePieChart data={calculateCategoryData()} />
            <MonthlyBarChart data={[
              { month: 'This Month', amount: totalExpenses }
            ]} />
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  title: {
    color: 'white',
    marginBottom: '2rem',
    fontSize: '2.5rem',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    color: 'white',
    fontSize: '1.2rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  statCard: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    color: 'white',
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: '0.5rem 0',
    color: 'white',
  },
  statSubtext: {
    opacity: 0.9,
    fontSize: '0.9rem',
  },
  budgetSection: {
    marginBottom: '2rem',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '1.5rem',
  },
};

export default Dashboard;
