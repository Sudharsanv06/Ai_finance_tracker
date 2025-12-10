import React from 'react';
import { deleteExpense } from '../services/expenseService';

function ExpenseTable({ expenses, onExpenseDeleted, onEdit }) {
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id);
        if (onExpenseDeleted) onExpenseDeleted();
      } catch (error) {
        alert('Failed to delete expense');
      }
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Food: '#ffa07a',
      Transport: '#87ceeb',
      Shopping: '#dda0dd',
      Bills: '#f08080',
      Entertainment: '#ffb6c1',
      Health: '#98fb98',
      Education: '#ffffe0',
      Others: '#d3d3d3',
    };
    return colors[category] || '#d3d3d3';
  };

  return (
    <div style={styles.container}>
      <h3>Recent Expenses</h3>
      {expenses.length === 0 ? (
        <p style={styles.empty}>No expenses yet. Add your first expense above!</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Payment</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>AI</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense._id} style={styles.tr}>
                <td style={styles.td}>{new Date(expense.date).toLocaleDateString()}</td>
                <td style={styles.td}>{expense.description}</td>
                <td style={styles.td}>
                  <span style={{...styles.badge, background: getCategoryColor(expense.category)}}>
                    {expense.category}
                  </span>
                </td>
                <td style={styles.td}>{expense.paymentMethod}</td>
                <td style={styles.td}>₹{expense.amount.toFixed(2)}</td>
                <td style={styles.td}>{expense.aiCategorized ? '🤖' : '👤'}</td>
                <td style={styles.td}>
                  <div style={styles.actions}>
                    <button onClick={() => onEdit(expense)} style={styles.editBtn}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(expense._id)} style={styles.deleteBtn}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  container: {
    background: 'white',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    marginTop: '2rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
  },
  th: {
    background: '#f8f9fa',
    padding: '0.75rem',
    textAlign: 'left',
    fontWeight: '600',
    borderBottom: '2px solid #dee2e6',
  },
  tr: {
    borderBottom: '1px solid #dee2e6',
  },
  td: {
    padding: '0.75rem',
    verticalAlign: 'middle',
  },
  badge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
  },
  editBtn: {
    background: '#667eea',
    color: 'white',
    border: 'none',
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  deleteBtn: {
    background: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  empty: {
    textAlign: 'center',
    color: '#6c757d',
    padding: '2rem',
    fontSize: '1.1rem',
  },
};

export default ExpenseTable;
