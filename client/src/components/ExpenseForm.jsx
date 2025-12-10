import React, { useState } from 'react';
import { createExpense, categorizeExpense } from '../services/expenseService';

function ExpenseForm({ onExpenseAdded }) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Others',
    paymentMethod: 'Other',
    date: new Date().toISOString().split('T')[0],
  });
  const [useAI, setUseAI] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Others'];
  const paymentMethods = ['Cash', 'UPI', 'Card', 'NetBanking', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let expenseData = { ...formData, amount: parseFloat(formData.amount) };

      if (useAI) {
        const aiResult = await categorizeExpense({
          description: formData.description,
          amount: formData.amount,
        });
        expenseData.category = aiResult.category;
        expenseData.aiCategorized = true;
        expenseData.aiNotes = aiResult.notes;
      }

      await createExpense(expenseData);
      setFormData({
        description: '',
        amount: '',
        category: 'Others',
        paymentMethod: 'Other',
        date: new Date().toISOString().split('T')[0],
      });
      if (onExpenseAdded) onExpenseAdded();
      alert('Expense added successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3>Add New Expense</h3>
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
        style={styles.input}
      />
      <select
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        style={styles.input}
        disabled={useAI}
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
      <label style={styles.checkbox}>
        <input
          type="checkbox"
          checked={useAI}
          onChange={(e) => setUseAI(e.target.checked)}
        />
        Use AI to categorize
      </label>
      <button type="submit" disabled={loading} style={styles.button}>
        {loading ? 'Adding...' : 'Add Expense'}
      </button>
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
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
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
};

export default ExpenseForm;
