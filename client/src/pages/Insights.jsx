import React, { useState, useEffect } from 'react';
import { getInsights, generateInsight } from '../services/aiService';

function Insights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const data = await getInsights();
      setInsights(data);
    } catch (error) {
      console.error('Failed to fetch insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInsight = async () => {
    setGenerating(true);
    try {
      await generateInsight();
      fetchInsights();
      alert('New insight generated successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to generate insight');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>AI Insights</h1>

      <div style={styles.header}>
        <p style={styles.description}>
          Get AI-powered insights about your spending patterns and financial health.
        </p>
        <button 
          onClick={handleGenerateInsight} 
          disabled={generating}
          style={styles.generateBtn}
        >
          {generating ? '🤖 Generating...' : '🤖 Generate New Insight'}
        </button>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading insights...</div>
      ) : insights.length === 0 ? (
        <div style={styles.empty}>
          <p>No insights available yet.</p>
          <p>Click the button above to generate your first AI insight!</p>
        </div>
      ) : (
        <div style={styles.insightsList}>
          {insights.map((insight) => (
            <div key={insight._id} style={styles.insightCard}>
              <div style={styles.insightHeader}>
                <span style={styles.badge}>{insight.type.replace('_', ' ')}</span>
                <span style={styles.period}>{insight.period}</span>
              </div>
              <p style={styles.insightText}>{insight.aiText}</p>
              <div style={styles.insightFooter}>
                <span style={styles.date}>
                  {new Date(insight.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
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
    marginBottom: '1rem',
    fontSize: '2.5rem',
  },
  header: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '10px',
    marginBottom: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  description: {
    color: '#666',
    margin: 0,
  },
  generateBtn: {
    background: '#667eea',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '500',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    color: 'white',
    fontSize: '1.2rem',
  },
  empty: {
    background: 'white',
    padding: '3rem',
    borderRadius: '10px',
    textAlign: 'center',
    color: '#666',
  },
  insightsList: {
    display: 'grid',
    gap: '1.5rem',
  },
  insightCard: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  insightHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  badge: {
    background: '#667eea',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.875rem',
    textTransform: 'capitalize',
  },
  period: {
    color: '#666',
    fontSize: '0.875rem',
  },
  insightText: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: '#333',
    marginBottom: '1rem',
  },
  insightFooter: {
    borderTop: '1px solid #e9ecef',
    paddingTop: '0.75rem',
  },
  date: {
    color: '#999',
    fontSize: '0.875rem',
  },
};

export default Insights;
