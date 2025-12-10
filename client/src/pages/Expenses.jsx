import React, { useState, useEffect } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseTable from '../components/ExpenseTable';
import { getExpenses } from '../services/expenseService';

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState(null);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await getExpenses();
      setExpenses(data);
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleExpenseAdded = () => {
    fetchExpenses();
    setEditingExpense(null);
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading expenses...</div>
      </div>
    );
  }

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Expense Tracker</h1>
        <div style={styles.stats}>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Total Expenses</span>
            <span style={styles.statValue}>{expenses.length}</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Total Spent</span>
            <span style={styles.statValue}>₹{totalSpent.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <ExpenseForm 
        onExpenseAdded={handleExpenseAdded} 
        editingExpense={editingExpense}
        onCancelEdit={handleCancelEdit}
      />
      
      <ExpenseTable 
        expenses={expenses} 
        onExpenseDeleted={fetchExpenses}
        onEdit={handleEdit}
      />
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  header: {
    marginBottom: '2rem',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginTop: '1rem',
  },
  statCard: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '1.5rem',
    borderRadius: '10px',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  statLabel: {
    fontSize: '0.9rem',
    opacity: 0.9,
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
    color: '#6c757d',
  },
};

export default Expenses;
