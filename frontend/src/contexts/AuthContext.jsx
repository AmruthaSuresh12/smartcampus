import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists in localStorage
    const storedUser = localStorage.getItem('campusUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5005/api/auth/login', { email, password });
      setUser(response.data.user);
      localStorage.setItem('campusToken', response.data.token);
      localStorage.setItem('campusUser', JSON.stringify(response.data.user));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.error || 'Login failed' };
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const response = await axios.post('http://localhost:5005/api/auth/register', { name, email, password, role });
      setUser(response.data.user);
      localStorage.setItem('campusToken', response.data.token);
      localStorage.setItem('campusUser', JSON.stringify(response.data.user));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.error || 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('campusToken');
    localStorage.removeItem('campusUser');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};






