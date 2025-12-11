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

  const calculateMonthlyData = () => {
    const monthlyData = {};
    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { month: monthName, amount: 0 };
      }
      monthlyData[monthYear].amount += expense.amount;
    });
    
    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month)).slice(-6);
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  // Get current month's budget
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const currentBudget = budgets.find(b => b.month === currentMonth && b.year === currentYear);
  const budgetLimit = currentBudget?.totalLimit || 0;
  
  // Calculate monthly expenses (current month)
  const monthlyExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() + 1 === currentMonth && expDate.getFullYear() === currentYear;
  });
  const monthlyTotal = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  const remainingBudget = budgetLimit - monthlyTotal;
  const budgetUsedPercentage = budgetLimit > 0 ? ((monthlyTotal / budgetLimit) * 100).toFixed(1) : 0;

  if (loading) {
    return <div style={styles.loading}>Loading dashboard...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>💰 Financial Dashboard</h1>
      
      {/* Budget Warning */}
      {budgetLimit > 0 && budgetUsedPercentage > 90 && (
        <div style={{
          ...styles.warning,
          background: budgetUsedPercentage > 100 ? '#fee' : '#fff3cd',
          color: budgetUsedPercentage > 100 ? '#c33' : '#856404',
          borderLeft: `4px solid ${budgetUsedPercentage > 100 ? '#c33' : '#ffc107'}`,
        }}>
          <strong>⚠️ Budget Alert:</strong> You've used {budgetUsedPercentage}% of your monthly budget!
          {budgetUsedPercentage > 100 && ` You're over budget by $${Math.abs(remainingBudget).toFixed(2)}.`}
        </div>
      )}
      
      <div style={styles.statsGrid}>
        <div style={{...styles.statCard, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
          <h3>Total Expenses</h3>
          <p style={styles.statValue}>${totalExpenses.toFixed(2)}</p>
          <small style={styles.statSubtext}>{expenses.length} transactions</small>
        </div>
        <div style={{...styles.statCard, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
          <h3>This Month</h3>
          <p style={styles.statValue}>${monthlyTotal.toFixed(2)}</p>
          <small style={styles.statSubtext}>{monthlyExpenses.length} transactions</small>
        </div>
        <div style={{...styles.statCard, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>
          <h3>Monthly Budget</h3>
          <p style={styles.statValue}>${budgetLimit.toFixed(2)}</p>
          <small style={styles.statSubtext}>{budgetUsedPercentage}% used</small>
        </div>
        <div style={{...styles.statCard, background: remainingBudget >= 0 ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'}}>
          <h3>Remaining</h3>
          <p style={styles.statValue}>${Math.abs(remainingBudget).toFixed(2)}</p>
          <small style={styles.statSubtext}>{remainingBudget >= 0 ? 'Within budget' : 'Over budget!'}</small>
        </div>
      </div>

      <div style={styles.chartsGrid}>
        {expenses.length > 0 ? (
          <>
            <ExpensePieChart data={calculateCategoryData()} />
            <MonthlyBarChart data={calculateMonthlyData()} />
          </>
        ) : (
          <div style={styles.emptyState}>
            <h3>No expense data yet</h3>
            <p>Start adding expenses to see your financial insights!</p>
          </div>
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
    color: '#333',
    marginBottom: '2rem',
    fontSize: '2.5rem',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
    color: '#666',
  },
  warning: {
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    fontSize: '1rem',
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
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    color: 'white',
    transition: 'transform 0.2s',
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
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '1.5rem',
  },
  emptyState: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '4rem 2rem',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    color: '#666',
  },
};

export default Dashboard;
