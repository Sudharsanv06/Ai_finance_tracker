import React, { useState, useEffect } from 'react';
import { getBudgets, createBudget, updateBudget, deleteBudget } from '../services/budgetService';
import { getExpenses } from '../services/expenseService';
import BudgetForm from '../components/BudgetForm';
import BudgetCard from '../components/BudgetCard';

function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [editingBudget, setEditingBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [budgetsData, expensesData] = await Promise.all([
        getBudgets(),
        getExpenses(),
      ]);
      setBudgets(budgetsData);
      setExpenses(expensesData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBudgetSaved = async (budgetData) => {
    try {
      if (editingBudget) {
        await updateBudget(editingBudget._id, budgetData);
        setEditingBudget(null);
      } else {
        await createBudget(budgetData);
      }
      await fetchData();
      setShowForm(false);
    } catch (error) {
      throw error;
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await deleteBudget(id);
        await fetchData();
      } catch (error) {
        console.error('Failed to delete budget:', error);
        alert('Failed to delete budget');
      }
    }
  };

  const handleCancel = () => {
    setEditingBudget(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading budgets...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Budget Management</h1>
        {!showForm && (
          <button onClick={() => setShowForm(true)} style={styles.addButton}>
            + New Budget
          </button>
        )}
      </div>

      {showForm && (
        <BudgetForm
          onBudgetSaved={handleBudgetSaved}
          editingBudget={editingBudget}
          onCancel={handleCancel}
        />
      )}

      <div style={styles.stats}>
        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Total Budgets</h3>
          <p style={styles.statValue}>{budgets.length}</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Current Month</h3>
          <p style={styles.statValue}>
            {budgets.find(b => {
              const now = new Date();
              return b.month === now.getMonth() + 1 && b.year === now.getFullYear();
            }) ? 'Set' : 'Not Set'}
          </p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Total Expenses</h3>
          <p style={styles.statValue}>{expenses.length}</p>
        </div>
      </div>

      <div style={styles.budgetList}>
        <h2 style={styles.sectionTitle}>Your Budgets</h2>
        {budgets.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>No budgets set yet.</p>
            <p style={styles.emptySubtext}>
              Create your first budget to start tracking your spending!
            </p>
            <button onClick={() => setShowForm(true)} style={styles.emptyButton}>
              Create Budget
            </button>
          </div>
        ) : (
          budgets.map((budget) => (
            <BudgetCard
              key={budget._id}
              budget={budget}
              expenses={expenses}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  pageTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#333',
    margin: 0,
  },
  addButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  statCard: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(102,126,234,0.3)',
    textAlign: 'center',
  },
  statTitle: {
    fontSize: '0.9rem',
    fontWeight: '600',
    margin: '0 0 0.5rem 0',
    textTransform: 'uppercase',
    opacity: 0.9,
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: '700',
    margin: 0,
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '1.5rem',
  },
  budgetList: {
    marginTop: '2rem',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
    color: '#666',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  emptyText: {
    fontSize: '1.2rem',
    color: '#666',
    margin: '0 0 0.5rem 0',
  },
  emptySubtext: {
    fontSize: '1rem',
    color: '#999',
    margin: '0 0 2rem 0',
  },
  emptyButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default Budgets;
