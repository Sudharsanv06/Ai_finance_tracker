import React, { useState, useEffect } from 'react';
import { getBudgets, createBudget, updateBudget } from '../services/budgetService';

function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    totalLimit: '',
  });

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const data = await getBudgets();
      setBudgets(data);
    } catch (error) {
      console.error('Failed to fetch budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBudget({
        ...formData,
        totalLimit: parseFloat(formData.totalLimit),
      });
      setFormData({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        totalLimit: '',
      });
      fetchBudgets();
      alert('Budget created successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create budget');
    }
  };

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Manage Budgets</h1>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <h3>Create New Budget</h3>
        <div style={styles.formGrid}>
          <select
            value={formData.month}
            onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
            style={styles.input}
          >
            {monthNames.map((month, index) => (
              <option key={index} value={index + 1}>{month}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Year"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
            required
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Total Budget Limit"
            value={formData.totalLimit}
            onChange={(e) => setFormData({ ...formData, totalLimit: e.target.value })}
            required
            step="0.01"
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Create Budget</button>
        </div>
      </form>

      <div style={styles.budgetList}>
        <h3>Existing Budgets</h3>
        {loading ? (
          <p style={styles.loading}>Loading budgets...</p>
        ) : budgets.length === 0 ? (
          <p style={styles.empty}>No budgets created yet.</p>
        ) : (
          <div style={styles.grid}>
            {budgets.map((budget) => (
              <div key={budget._id} style={styles.budgetCard}>
                <h4>{monthNames[budget.month - 1]} {budget.year}</h4>
                <p style={styles.amount}>₹{budget.totalLimit.toFixed(2)}</p>
                <p style={styles.date}>
                  Created: {new Date(budget.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
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
    color: 'white',
    marginBottom: '2rem',
    fontSize: '2.5rem',
  },
  form: {
    background: 'white',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginTop: '1rem',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
  },
  button: {
    background: '#667eea',
    color: 'white',
    border: 'none',
    padding: '0.75rem',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '500',
  },
  budgetList: {
    background: 'white',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginTop: '1rem',
  },
  budgetCard: {
    background: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '2px solid #e9ecef',
  },
  amount: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#667eea',
    margin: '0.5rem 0',
  },
  date: {
    color: '#666',
    fontSize: '0.875rem',
  },
  loading: {
    textAlign: 'center',
    color: '#666',
  },
  empty: {
    textAlign: 'center',
    color: '#666',
    padding: '2rem',
  },
};

export default Budgets;
