import React, { useState, useEffect } from 'react';
import { getInsights, generateInsight, askQuestion } from '../services/aiService';

function Insights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [question, setQuestion] = useState('');
  const [asking, setAsking] = useState(false);
  const [qaHistory, setQaHistory] = useState([]);

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

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setAsking(true);
    try {
      const response = await askQuestion(question);
      setQaHistory([
        { question: response.question, answer: response.answer, timestamp: new Date() },
        ...qaHistory
      ]);
      setQuestion('');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to get answer');
    } finally {
      setAsking(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>AI Insights</h1>

      {/* Generate Insights Section */}
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

      {/* Ask a Question Section */}
      <div style={styles.askSection}>
        <h2 style={styles.sectionTitle}>💬 Ask About Your Spending</h2>
        <form onSubmit={handleAskQuestion} style={styles.askForm}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., How much did I spend on food this month?"
            style={styles.questionInput}
            disabled={asking}
          />
          <button 
            type="submit" 
            disabled={asking || !question.trim()}
            style={styles.askBtn}
          >
            {asking ? 'Asking...' : 'Ask'}
          </button>
        </form>

        {/* Q&A History */}
        {qaHistory.length > 0 && (
          <div style={styles.qaHistory}>
            {qaHistory.map((qa, index) => (
              <div key={index} style={styles.qaCard}>
                <div style={styles.questionBox}>
                  <strong style={styles.qaLabel}>Q:</strong>
                  <span style={styles.qaQuestion}>{qa.question}</span>
                </div>
                <div style={styles.answerBox}>
                  <strong style={styles.qaLabel}>A:</strong>
                  <span style={styles.qaAnswer}>{qa.answer}</span>
                </div>
                <div style={styles.qaTime}>
                  {qa.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Monthly Insights */}
      <h2 style={styles.sectionTitle}>📊 Monthly AI Summaries</h2>
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
  sectionTitle: {
    color: 'white',
    marginTop: '2rem',
    marginBottom: '1rem',
    fontSize: '1.75rem',
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
  askSection: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '10px',
    marginBottom: '2rem',
  },
  askForm: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  questionInput: {
    flex: 1,
    padding: '0.75rem',
    border: '2px solid #e9ecef',
    borderRadius: '5px',
    fontSize: '1rem',
    outline: 'none',
  },
  askBtn: {
    background: '#10b981',
    color: 'white',
    border: 'none',
    padding: '0.75rem 2rem',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '500',
  },
  qaHistory: {
    display: 'grid',
    gap: '1rem',
  },
  qaCard: {
    background: '#f8f9fa',
    padding: '1rem',
    borderRadius: '8px',
    borderLeft: '4px solid #10b981',
  },
  questionBox: {
    marginBottom: '0.75rem',
  },
  answerBox: {
    marginBottom: '0.5rem',
  },
  qaLabel: {
    color: '#667eea',
    marginRight: '0.5rem',
    fontSize: '1rem',
  },
  qaQuestion: {
    color: '#333',
    fontSize: '1rem',
  },
  qaAnswer: {
    color: '#555',
    fontSize: '1rem',
    lineHeight: '1.5',
  },
  qaTime: {
    color: '#999',
    fontSize: '0.75rem',
    textAlign: 'right',
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
