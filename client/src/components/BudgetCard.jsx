import React from 'react';

function BudgetCard({ budget, expenses, onEdit, onDelete }) {
  const getMonthName = (monthNum) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthNum - 1];
  };

  // Calculate total spent from expenses for this budget period
  const totalSpent = expenses
    .filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() + 1 === budget.month && expDate.getFullYear() === budget.year;
    })
    .reduce((sum, exp) => sum + exp.amount, 0);

  const remaining = budget.totalLimit - totalSpent;
  const percentageUsed = (totalSpent / budget.totalLimit) * 100;
  
  // Calculate category-wise spending
  const categorySpending = {};
  expenses.forEach(exp => {
    const expDate = new Date(exp.date);
    if (expDate.getMonth() + 1 === budget.month && expDate.getFullYear() === budget.year) {
      categorySpending[exp.category] = (categorySpending[exp.category] || 0) + exp.amount;
    }
  });

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>
            {getMonthName(budget.month)} {budget.year}
          </h3>
          <p style={styles.budgetAmount}>Total Budget: ${budget.totalLimit.toFixed(2)}</p>
        </div>
        <div style={styles.actions}>
          <button onClick={() => onEdit(budget)} style={styles.editButton}>
            Edit
          </button>
          <button onClick={() => onDelete(budget._id)} style={styles.deleteButton}>
            Delete
          </button>
        </div>
      </div>

      <div style={styles.overview}>
        <div style={styles.statBox}>
          <span style={styles.statLabel}>Spent</span>
          <span style={{...styles.statValue, color: totalSpent > budget.totalLimit ? '#e74c3c' : '#3498db'}}>
            ${totalSpent.toFixed(2)}
          </span>
        </div>
        <div style={styles.statBox}>
          <span style={styles.statLabel}>Remaining</span>
          <span style={{...styles.statValue, color: remaining < 0 ? '#e74c3c' : '#27ae60'}}>
            ${remaining.toFixed(2)}
          </span>
        </div>
        <div style={styles.statBox}>
          <span style={styles.statLabel}>Used</span>
          <span style={{
            ...styles.statValue,
            color: percentageUsed > 90 ? '#e74c3c' : percentageUsed > 70 ? '#f39c12' : '#27ae60'
          }}>
            {percentageUsed.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div style={styles.progressSection}>
        <div style={styles.progressBar}>
          <div style={{
            ...styles.progressFill,
            width: `${Math.min(percentageUsed, 100)}%`,
            background: percentageUsed > 90 ? 'linear-gradient(90deg, #e74c3c, #c0392b)' 
                      : percentageUsed > 70 ? 'linear-gradient(90deg, #f39c12, #e67e22)'
                      : 'linear-gradient(90deg, #27ae60, #229954)',
          }} />
        </div>
      </div>

      {/* Category Limits */}
      {budget.categoryLimits && budget.categoryLimits.length > 0 && (
        <div style={styles.categorySection}>
          <h4 style={styles.categoryTitle}>Category Budgets</h4>
          <div style={styles.categoryList}>
            {budget.categoryLimits.map((catLimit) => {
              const spent = categorySpending[catLimit.category] || 0;
              const catPercentage = (spent / catLimit.limit) * 100;
              const catRemaining = catLimit.limit - spent;

              return (
                <div key={catLimit.category} style={styles.categoryItem}>
                  <div style={styles.categoryHeader}>
                    <span style={styles.categoryName}>{catLimit.category}</span>
                    <span style={styles.categoryAmount}>
                      ${spent.toFixed(2)} / ${catLimit.limit.toFixed(2)}
                    </span>
                  </div>
                  <div style={styles.categoryProgressBar}>
                    <div style={{
                      ...styles.categoryProgressFill,
                      width: `${Math.min(catPercentage, 100)}%`,
                      background: catPercentage > 100 ? '#e74c3c' 
                                : catPercentage > 90 ? '#f39c12'
                                : '#3498db',
                    }} />
                  </div>
                  <div style={styles.categoryFooter}>
                    <span style={{
                      ...styles.categoryRemaining,
                      color: catRemaining < 0 ? '#e74c3c' : '#666',
                    }}>
                      {catRemaining < 0 ? 'Over' : 'Remaining'}: ${Math.abs(catRemaining).toFixed(2)}
                    </span>
                    <span style={styles.categoryPercentage}>
                      {catPercentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Warning if over budget */}
      {percentageUsed > 100 && (
        <div style={styles.warning}>
          ⚠️ Budget exceeded by ${(totalSpent - budget.totalLimit).toFixed(2)}!
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    padding: '1.5rem',
    marginBottom: '1.5rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '1rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#333',
    margin: '0 0 0.5rem 0',
  },
  budgetAmount: {
    fontSize: '1rem',
    color: '#666',
    margin: 0,
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
  },
  editButton: {
    background: '#3498db',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  deleteButton: {
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  overview: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  statBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1rem',
    background: '#f8f9fa',
    borderRadius: '8px',
  },
  statLabel: {
    fontSize: '0.85rem',
    color: '#666',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
  },
  progressSection: {
    marginBottom: '1.5rem',
  },
  progressBar: {
    width: '100%',
    height: '20px',
    background: '#e0e0e0',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    transition: 'width 0.3s ease',
  },
  categorySection: {
    marginTop: '1.5rem',
    borderTop: '2px solid #f0f0f0',
    paddingTop: '1.5rem',
  },
  categoryTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '1rem',
  },
  categoryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  categoryItem: {
    background: '#f8f9fa',
    padding: '1rem',
    borderRadius: '8px',
  },
  categoryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
  },
  categoryName: {
    fontWeight: '600',
    color: '#333',
  },
  categoryAmount: {
    color: '#666',
    fontSize: '0.9rem',
  },
  categoryProgressBar: {
    width: '100%',
    height: '8px',
    background: '#e0e0e0',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '0.5rem',
  },
  categoryProgressFill: {
    height: '100%',
    transition: 'width 0.3s ease',
  },
  categoryFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
  },
  categoryRemaining: {
    fontWeight: '500',
  },
  categoryPercentage: {
    color: '#666',
  },
  warning: {
    background: '#fee',
    color: '#c33',
    padding: '1rem',
    borderRadius: '8px',
    marginTop: '1rem',
    fontWeight: '600',
    textAlign: 'center',
  },
};

export default BudgetCard;
