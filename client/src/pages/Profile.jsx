import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile } from '../services/userService';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    currency: 'INR'
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await getUserProfile();
      setProfile(data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      alert('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const updated = await updateUserProfile({
        name: profile.name,
        currency: profile.currency
      });
      setProfile(updated);
      alert('Profile updated successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading profile...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>👤 My Profile</h1>

      <div style={styles.card}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={profile.email}
              style={{ ...styles.input, ...styles.readOnly }}
              disabled
            />
            <small style={styles.hint}>Email cannot be changed</small>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Preferred Currency</label>
            <select
              value={profile.currency}
              onChange={(e) => setProfile({ ...profile, currency: e.target.value })}
              style={styles.select}
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="AUD">AUD (A$)</option>
              <option value="CAD">CAD (C$)</option>
            </select>
          </div>

          <div style={styles.buttonGroup}>
            <button 
              type="submit" 
              disabled={updating}
              style={styles.saveBtn}
            >
              {updating ? 'Saving...' : '💾 Save Changes'}
            </button>
            
            <button 
              type="button"
              onClick={handleLogout}
              style={styles.logoutBtn}
            >
              🚪 Logout
            </button>
          </div>
        </form>
      </div>

      <div style={styles.infoCard}>
        <h3 style={styles.infoTitle}>ℹ️ Account Information</h3>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Member since:</span>
          <span style={styles.infoValue}>
            {new Date(profile.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Last updated:</span>
          <span style={styles.infoValue}>
            {new Date(profile.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
  },
  title: {
    color: 'white',
    marginBottom: '2rem',
    fontSize: '2.5rem',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    color: 'white',
    fontSize: '1.2rem',
  },
  card: {
    background: 'white',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontWeight: '600',
    color: '#333',
    fontSize: '0.95rem',
  },
  input: {
    padding: '0.75rem',
    border: '2px solid #e9ecef',
    borderRadius: '5px',
    fontSize: '1rem',
    outline: 'none',
  },
  readOnly: {
    background: '#f8f9fa',
    cursor: 'not-allowed',
  },
  select: {
    padding: '0.75rem',
    border: '2px solid #e9ecef',
    borderRadius: '5px',
    fontSize: '1rem',
    outline: 'none',
    cursor: 'pointer',
  },
  hint: {
    color: '#999',
    fontSize: '0.85rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  },
  saveBtn: {
    flex: 1,
    background: '#667eea',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '500',
  },
  logoutBtn: {
    flex: 1,
    background: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '500',
  },
  infoCard: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  infoTitle: {
    color: '#333',
    marginBottom: '1rem',
    fontSize: '1.25rem',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 0',
    borderBottom: '1px solid #e9ecef',
  },
  infoLabel: {
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    color: '#333',
  },
};

export default Profile;
