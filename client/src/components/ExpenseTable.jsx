import React from 'react';
import { deleteExpense } from '../services/expenseService';

function ExpenseTable({ expenses, onExpenseDeleted }) {
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

  return (
    <div style={styles.container}>
      <h3>Recent Expenses</h3>
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
              <td style={styles.td}>{expense.category}</td>
              <td style={styles.td}>{expense.paymentMethod}</td>
              <td style={styles.td}>₹{expense.amount.toFixed(2)}</td>
              <td style={styles.td}>{expense.aiCategorized ? '🤖' : '👤'}</td>
              <td style={styles.td}>
                <button onClick={() => handleDelete(expense._id)} style={styles.deleteBtn}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {expenses.length === 0 && (
        <p style={styles.empty}>No expenses yet. Add your first expense above!</p>
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
  },
  deleteBtn: {
    background: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.875rem',
  },
  empty: {
    textAlign: 'center',
    color: '#666',
    padding: '2rem',
  },
};

export default ExpenseTable;
