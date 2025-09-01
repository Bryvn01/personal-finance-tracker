import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const userData = JSON.parse(localStorage.getItem('user'));
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Get CSRF token first
      let csrfToken = sessionStorage.getItem('csrfToken');
      if (!csrfToken) {
        try {
          const csrfResponse = await axios.get('http://localhost:5001/api/csrf-token');
          csrfToken = csrfResponse.data.csrfToken;
          sessionStorage.setItem('csrfToken', csrfToken);
        } catch (csrfError) {
          console.warn('Could not get CSRF token, proceeding without it');
        }
      }
      
      const response = await axios.post('http://localhost:5001/api/auth/login', {
        email,
        password
      }, {
        headers: csrfToken ? { 'X-CSRF-Token': csrfToken } : {}
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different types of errors with specific messages
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 400) {
          if (data.errors && Array.isArray(data.errors)) {
            return { success: false, message: data.errors.map(e => e.msg).join(', ') };
          }
          return { success: false, message: data.message || 'Invalid email or password' };
        } else if (status === 403) {
          return { success: false, message: 'Security token expired. Please refresh the page and try again.' };
        } else if (status === 500) {
          return { success: false, message: 'Server error. Please try again later.' };
        }
        
        return { success: false, message: data.message || 'Login failed' };
      } else if (error.request) {
        return { success: false, message: 'Cannot connect to server. Please check your internet connection.' };
      } else {
        return { success: false, message: 'An unexpected error occurred. Please try again.' };
      }
    }
  };

  const register = async (username, email, password) => {
    try {
      // Get CSRF token first
      let csrfToken = sessionStorage.getItem('csrfToken');
      if (!csrfToken) {
        try {
          const csrfResponse = await axios.get('http://localhost:5001/api/csrf-token');
          csrfToken = csrfResponse.data.csrfToken;
          sessionStorage.setItem('csrfToken', csrfToken);
        } catch (csrfError) {
          console.warn('Could not get CSRF token, proceeding without it');
        }
      }
      
      const response = await axios.post('http://localhost:5001/api/auth/register', {
        username,
        email,
        password
      }, {
        headers: csrfToken ? { 'X-CSRF-Token': csrfToken } : {}
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle different types of errors with specific messages
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 400) {
          if (data.errors && Array.isArray(data.errors)) {
            return { success: false, message: data.errors.map(e => e.msg).join(', ') };
          }
          if (data.message.includes('User already exists')) {
            return { success: false, message: 'An account with this email or username already exists. Please try logging in instead.' };
          }
          return { success: false, message: data.message || 'Invalid registration data' };
        } else if (status === 403) {
          return { success: false, message: 'Security token expired. Please refresh the page and try again.' };
        } else if (status === 500) {
          return { success: false, message: 'Server error. Please try again later.' };
        }
        
        return { success: false, message: data.message || 'Registration failed' };
      } else if (error.request) {
        return { success: false, message: 'Cannot connect to server. Please check your internet connection.' };
      } else {
        return { success: false, message: 'An unexpected error occurred. Please try again.' };
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};