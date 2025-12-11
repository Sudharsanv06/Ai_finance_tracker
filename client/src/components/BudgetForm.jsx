import React, { useState, useEffect } from 'react';

const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Other',
];

function BudgetForm({ onBudgetSaved, editingBudget, onCancel }) {
  const [formData, setFormData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    totalLimit: '',
    categoryLimits: [],
  });
  const [categoryInputs, setCategoryInputs] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingBudget) {
      setFormData({
        month: editingBudget.month,
        year: editingBudget.year,
        totalLimit: editingBudget.totalLimit,
        categoryLimits: editingBudget.categoryLimits || [],
      });
      
      // Convert categoryLimits array to object for easier input handling
      const catObj = {};
      (editingBudget.categoryLimits || []).forEach(cat => {
        catObj[cat.category] = cat.limit;
      });
      setCategoryInputs(catObj);
    }
  }, [editingBudget]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.totalLimit || formData.totalLimit <= 0) {
      setError('Total budget must be greater than 0');
      return;
    }

    setLoading(true);

    try {
      // Convert categoryInputs object back to array
      const categoryLimits = Object.entries(categoryInputs)
        .filter(([_, limit]) => limit > 0)
        .map(([category, limit]) => ({ category, limit: parseFloat(limit) }));

      const budgetData = {
        ...formData,
        totalLimit: parseFloat(formData.totalLimit),
        categoryLimits,
      };

      await onBudgetSaved(budgetData);
      
      if (!editingBudget) {
        // Reset form only if creating new budget
        setFormData({
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          totalLimit: '',
          categoryLimits: [],
        });
        setCategoryInputs({});
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save budget');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category, value) => {
    setCategoryInputs({
      ...categoryInputs,
      [category]: value === '' ? '' : parseFloat(value) || 0,
    });
  };

  const getMonthName = (monthNum) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthNum - 1];
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>
        {editingBudget ? 'Edit Budget' : 'Set Monthly Budget'}
      </h3>
      {error && <div style={styles.error}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.row}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Month</label>
            <select
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
              required
              style={styles.select}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                <option key={m} value={m}>
                  {getMonthName(m)}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Year</label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              required
              min="2020"
              max="2100"
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Total Budget ($)</label>
            <input
              type="number"
              value={formData.totalLimit}
              onChange={(e) => setFormData({ ...formData, totalLimit: e.target.value })}
              required
              min="0"
              step="0.01"
              placeholder="e.g., 3000"
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.categorySection}>
          <h4 style={styles.subtitle}>Category Limits (Optional)</h4>
          <div style={styles.categoryGrid}>
            {CATEGORIES.map((category) => (
              <div key={category} style={styles.categoryItem}>
                <label style={styles.categoryLabel}>{category}</label>
                <input
                  type="number"
                  value={categoryInputs[category] || ''}
                  onChange={(e) => handleCategoryChange(category, e.target.value)}
                  min="0"
                  step="0.01"
                  placeholder="Optional"
                  style={styles.categoryInput}
                />
              </div>
            ))}
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <button type="submit" disabled={loading} style={styles.submitButton}>
            {loading ? 'Saving...' : editingBudget ? 'Update Budget' : 'Save Budget'}
          </button>
          {editingBudget && (
            <button type="button" onClick={onCancel} style={styles.cancelButton}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '1.5rem',
    marginBottom: '1.5rem',
    color: '#333',
  },
  subtitle: {
    fontSize: '1.1rem',
    marginBottom: '1rem',
    color: '#555',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#555',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
  },
  select: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    background: 'white',
  },
  categorySection: {
    borderTop: '1px solid #eee',
    paddingTop: '1.5rem',
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1rem',
  },
  categoryItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  categoryLabel: {
    fontSize: '0.85rem',
    color: '#666',
  },
  categoryInput: {
    padding: '0.5rem',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    fontSize: '0.9rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '0.5rem',
  },
  submitButton: {
    flex: 1,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '0.75rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  cancelButton: {
    flex: 1,
    background: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '0.75rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  error: {
    background: '#fee',
    color: '#c33',
    padding: '0.75rem',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
};

export default BudgetForm;
