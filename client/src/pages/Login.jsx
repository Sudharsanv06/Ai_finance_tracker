import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Clear any stale tokens when login page loads
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with:', { email: formData.email });
      const data = await loginUser(formData);
      console.log('Login successful:', data);
      login(data);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err.response);
      const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login to AI Finance Tracker</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={styles.footer}>
          Don't have an account? <Link to="/register" style={styles.link}>Register</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 80px)',
    padding: '2rem',
  },
  card: {
    background: 'white',
    padding: '2.5rem',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '2rem',
    color: '#333',
  },
  form: {
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
  button: {
    background: '#667eea',
    color: 'white',
    border: 'none',
    padding: '0.75rem',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '500',
    marginTop: '1rem',
  },
  error: {
    background: '#ffe6e6',
    color: '#dc3545',
    padding: '0.75rem',
    borderRadius: '5px',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  footer: {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: '#666',
  },
  link: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '500',
  },
};

export default Login;
