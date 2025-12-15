import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          💰 AI Finance Tracker
        </Link>
        <div style={styles.links}>
          {user ? (
            <>
              <Link to="/" style={styles.link}>Dashboard</Link>
              <Link to="/expenses" style={styles.link}>Expenses</Link>
              <Link to="/budgets" style={styles.link}>Budgets</Link>
              <Link to="/insights" style={styles.link}>Insights</Link>
              <Link to="/profile" style={styles.link}>Profile</Link>
              <span style={styles.user}>👤 {user.name}</span>
              <button onClick={handleLogout} style={styles.button}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/register" style={styles.link}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    background: 'rgba(255, 255, 255, 0.95)',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    padding: '1rem 0',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#667eea',
    textDecoration: 'none',
  },
  links: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
  },
  link: {
    color: '#333',
    textDecoration: 'none',
    fontWeight: '500',
  },
  user: {
    color: '#666',
    fontSize: '0.9rem',
  },
  button: {
    background: '#667eea',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: '500',
  },
};

export default Navbar;
