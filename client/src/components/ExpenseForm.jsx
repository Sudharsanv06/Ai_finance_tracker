import React, { useState, useEffect } from 'react';
import { createExpense, updateExpense, categorizeExpense } from '../services/expenseService';

function ExpenseForm({ onExpenseAdded, editingExpense, onCancelEdit }) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Others',
    paymentMethod: 'Other',
    date: new Date().toISOString().split('T')[0],
  });
  const [useAI, setUseAI] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Others'];
  const paymentMethods = ['Cash', 'UPI', 'Card', 'NetBanking', 'Other'];

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        description: editingExpense.description,
        amount: editingExpense.amount.toString(),
        category: editingExpense.category,
        paymentMethod: editingExpense.paymentMethod,
        date: editingExpense.date ? new Date(editingExpense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      });
    }
  }, [editingExpense]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const amount = parseFloat(formData.amount);
      
      if (amount <= 0) {
        setError('Amount must be greater than 0');
        setLoading(false);
        return;
      }

      let expenseData = { ...formData, amount };

      if (useAI && !editingExpense) {
        const aiResult = await categorizeExpense({
          description: formData.description,
          amount: formData.amount,
        });
        expenseData.category = aiResult.category;
        expenseData.aiCategorized = true;
        expenseData.aiNotes = aiResult.notes;
      }

      if (editingExpense) {
        await updateExpense(editingExpense._id, expenseData);
      } else {
        await createExpense(expenseData);
      }

      setFormData({
        description: '',
        amount: '',
        category: 'Others',
        paymentMethod: 'Other',
        date: new Date().toISOString().split('T')[0],
      });
      if (onExpenseAdded) onExpenseAdded();
      if (onCancelEdit) onCancelEdit();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      description: '',
      amount: '',
      category: 'Others',
      paymentMethod: 'Other',
      date: new Date().toISOString().split('T')[0],
    });
    setError('');
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h3>
      {error && <div style={styles.error}>{error}</div>}
      <input
        type="text"
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        required
        style={styles.input}
      />
      <input
        type="number"
        placeholder="Amount"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        required
        step="0.01"
        min="0.01"
        style={styles.input}
      />
      <select
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        style={styles.input}
        disabled={useAI && !editingExpense}
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <select
        value={formData.paymentMethod}
        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
        style={styles.input}
      >
        {paymentMethods.map((method) => (
          <option key={method} value={method}>{method}</option>
        ))}
      </select>
      <input
        type="date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        required
        style={styles.input}
      />
      {!editingExpense && (
        <label style={styles.checkbox}>
          <input
            type="checkbox"
            checked={useAI}
            onChange={(e) => setUseAI(e.target.checked)}
          />
          Use AI to categorize
        </label>
      )}
      <div style={styles.buttonGroup}>
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Saving...' : (editingExpense ? 'Update Expense' : 'Add Expense')}
        </button>
        {editingExpense && (
          <button type="button" onClick={handleCancel} style={styles.cancelButton}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

const styles = {
  form: {
    background: 'white',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
  },
  error: {
    background: '#ffe6e6',
    color: '#dc3545',
    padding: '0.75rem',
    borderRadius: '5px',
    textAlign: 'center',
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
  },
  button: {
    flex: 1,
    background: '#667eea',
    color: 'white',
    border: 'none',
    padding: '0.75rem',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '500',
  },
  cancelButton: {
    flex: 1,
    background: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '0.75rem',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '500',
  },
};

export default ExpenseForm;
