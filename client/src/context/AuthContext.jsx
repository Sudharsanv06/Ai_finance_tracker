import { createContext, useContext, useEffect, useState } from 'react';
import { getProfile } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [skipFetch, setSkipFetch] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      // Skip fetch if we just logged in (user is already set)
      if (skipFetch) {
        setSkipFetch(false);
        setLoading(false);
        return;
      }

      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const data = await getProfile(token);
        setUser(data.user);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token, skipFetch]);

  const login = (data) => {
    console.log('AuthContext: Logging in user:', data);
    // Set all state synchronously
    setUser(data.user);
    setToken(data.token);
    setLoading(false);
    setSkipFetch(true); // Skip the fetch since we already have user data
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setLoading(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
