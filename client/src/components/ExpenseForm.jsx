import React, { useState, useEffect } from 'react';
import { createExpense, updateExpense } from '../services/expenseService';
import { categorizeExpense } from '../services/aiService';

function ExpenseForm({ onExpenseAdded, editingExpense, onCancelEdit }) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Others',
    paymentMethod: 'Other',
    date: new Date().toISOString().split('T')[0],
  });
  const [aiCategorized, setAiCategorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categorizingAI, setCategorizingAI] = useState(false);
  const [error, setError] = useState('');
  const [aiError, setAiError] = useState('');

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
      setAiCategorized(editingExpense.aiCategorized || false);
    }
  }, [editingExpense]);

  // Auto Categorize button handler
  const handleAutoCategorize = async () => {
    if (!formData.description || !formData.amount) {
      setAiError('Please enter description and amount first');
      return;
    }

    setCategorizingAI(true);
    setAiError('');

    try {
      const result = await categorizeExpense({
        description: formData.description,
        amount: parseFloat(formData.amount),
      });

      // Update category with AI suggestion
      setFormData({ ...formData, category: result.category });
      setAiCategorized(true);
      setAiError('');
    } catch (error) {
      console.error('AI categorization failed:', error);
      setAiError(error.response?.data?.message || 'AI categorization failed. Please select manually.');
      setAiCategorized(false);
    } finally {
      setCategorizingAI(false);
    }
  };

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

      const expenseData = { 
        ...formData, 
        amount,
        aiCategorized: aiCategorized,
      };

      if (editingExpense) {
        await updateExpense(editingExpense._id, expenseData);
      } else {
        await createExpense(expenseData);
      }

      // Reset form
      setFormData({
        description: '',
        amount: '',
        category: 'Others',
        paymentMethod: 'Other',
        date: new Date().toISOString().split('T')[0],
      });
      setAiCategorized(false);
      setAiError('');
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
      {aiError && <div style={styles.aiError}>{aiError}</div>}
      
      <input
        type="text"
        placeholder="Description (e.g., Pizza delivery, Uber ride, Netflix subscription)"
        value={formData.description}
        onChange={(e) => {
          setFormData({ ...formData, description: e.target.value });
          setAiCategorized(false); // Reset AI flag when user changes description
        }}
        required
        style={styles.input}
      />
      <input
        type="number"
        placeholder="Amount"
        value={formData.amount}
        onChange={(e) => {
          setFormData({ ...formData, amount: e.target.value });
          setAiCategorized(false); // Reset AI flag when user changes amount
        }}
        required
        step="0.01"
        min="0.01"
        style={styles.input}
      />
      
      <div style={styles.categoryRow}>
        <select
          value={formData.category}
          onChange={(e) => {
            setFormData({ ...formData, category: e.target.value });
            setAiCategorized(false); // Reset if manually changed
          }}
          style={{...styles.input, flex: 1}}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        <button
          type="button"
          onClick={handleAutoCategorize}
          disabled={categorizingAI || !formData.description || !formData.amount}
          style={{
            ...styles.aiButton,
            opacity: (!formData.description || !formData.amount) ? 0.5 : 1,
            cursor: (!formData.description || !formData.amount) ? 'not-allowed' : 'pointer',
          }}
          title="Auto categorize with AI"
        >
          {categorizingAI ? '⏳ Categorizing...' : '🤖 Auto Categorize'}
        </button>
      </div>
      
      {aiCategorized && (
        <div style={styles.aiSuccess}>
          ✅ AI suggested: <strong>{formData.category}</strong> (You can still change it manually)
        </div>
      )}
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
  aiError: {
    background: '#fff3cd',
    color: '#856404',
    padding: '0.75rem',
    borderRadius: '5px',
    textAlign: 'center',
    fontSize: '0.9rem',
  },
  aiSuccess: {
    background: '#d4edda',
    color: '#155724',
    padding: '0.75rem',
    borderRadius: '5px',
    textAlign: 'center',
    fontSize: '0.9rem',
  },
  categoryRow: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  aiButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '5px',
    fontSize: '0.9rem',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    transition: 'all 0.3s ease',
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
