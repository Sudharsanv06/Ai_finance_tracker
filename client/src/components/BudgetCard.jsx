import React from 'react';

function BudgetCard({ budget, spent, category }) {
  const percentage = budget > 0 ? (spent / budget) * 100 : 0;
  const isOverBudget = spent > budget;

  return (
    <div style={styles.card}>
      <h4 style={styles.title}>{category || 'Total Budget'}</h4>
      <div style={styles.amounts}>
        <p style={styles.spent}>Spent: ₹{spent.toFixed(2)}</p>
        <p style={styles.budget}>Budget: ₹{budget.toFixed(2)}</p>
      </div>
      <div style={styles.progressBar}>
        <div
          style={{
            ...styles.progress,
            width: `${Math.min(percentage, 100)}%`,
            background: isOverBudget ? '#dc3545' : '#28a745',
          }}
        />
      </div>
      <p style={isOverBudget ? styles.overBudget : styles.remaining}>
        {isOverBudget
          ? `Over by ₹${(spent - budget).toFixed(2)}`
          : `Remaining: ₹${(budget - spent).toFixed(2)}`}
      </p>
    </div>
  );
}

const styles = {
  card: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  title: {
    marginBottom: '1rem',
    color: '#333',
  },
  amounts: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  spent: {
    color: '#666',
    fontSize: '0.9rem',
  },
  budget: {
    color: '#666',
    fontSize: '0.9rem',
  },
  progressBar: {
    height: '10px',
    background: '#e9ecef',
    borderRadius: '5px',
    overflow: 'hidden',
    marginBottom: '0.5rem',
  },
  progress: {
    height: '100%',
    transition: 'width 0.3s ease',
  },
  remaining: {
    color: '#28a745',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  overBudget: {
    color: '#dc3545',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
};

export default BudgetCard;
