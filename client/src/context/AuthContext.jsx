import { createContext, useContext, useEffect, useState } from 'react';
import { getProfile } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
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
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const login = (data) => {
    console.log('AuthContext: Logging in user:', data);
    setToken(data.token);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
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
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
