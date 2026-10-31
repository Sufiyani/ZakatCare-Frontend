// import { createContext, useState, useEffect } from 'react';
// import axios from 'axios';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const userData = localStorage.getItem('user');
    
//     if (token && userData) {
//       setUser(JSON.parse(userData));
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     }
//     setLoading(false);
//   }, []);

//   const login = (userData, token) => {
//     localStorage.setItem('token', token);
//     localStorage.setItem('user', JSON.stringify(userData));
//     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     setUser(userData);
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     delete axios.defaults.headers.common['Authorization'];
//     setUser(null);
//   };

//   const value = {
//     user,
//     login,
//     logout,
//     loading,
//     isAdmin: user?.role === 'admin'
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// import { createContext, useState, useEffect } from 'react';
// import axios from 'axios';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [authLoading, setAuthLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const userData = localStorage.getItem('user');
    
//     if (token && userData) {
//       setUser(JSON.parse(userData));
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     }
//     setAuthLoading(false);
//   }, []);

//   const login = (userData, token) => {
//     localStorage.setItem('token', token);
//     localStorage.setItem('user', JSON.stringify(userData));
//     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     setUser(userData);
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     delete axios.defaults.headers.common['Authorization'];
//     setUser(null);
//   };

//   const value = {
//     user,
//     login,
//     logout,
//     authLoading,
//     isAdmin: user?.role === 'admin'
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };


import { createContext, useState, useEffect } from 'react';
import api from '../services/api'; // Global axios ki jagah apna api instance use kar rahe hain

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
          // Token ko hamare api instance ke headers mein set karna zaroori hai
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error) {
          console.error("Auth initialization error:", error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setAuthLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    // Login ke waqt foran header update karein
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    window.location.href = '/login';
  };

  const value = {
    user,
    login,
    logout,
    authLoading,
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};