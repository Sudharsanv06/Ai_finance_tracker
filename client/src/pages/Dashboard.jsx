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

  if (loading) {
    return <div style={styles.loading}>Loading dashboard...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard</h1>
      
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h3>Total Expenses</h3>
          <p style={styles.statValue}>₹{totalExpenses.toFixed(2)}</p>
        </div>
        <div style={styles.statCard}>
          <h3>Monthly Budget</h3>
          <p style={styles.statValue}>₹{currentBudget.toFixed(2)}</p>
        </div>
        <div style={styles.statCard}>
          <h3>Transactions</h3>
          <p style={styles.statValue}>{expenses.length}</p>
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
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#667eea',
    marginTop: '0.5rem',
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
