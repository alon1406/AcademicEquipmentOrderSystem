import React, { createContext, useState, useContext, useEffect } from 'react';
import { usersApi } from '../services/api';

const AuthContext = createContext();

// Key for storing user in localStorage
// TODO: [SECURITY] Replace with JWT token storage in future
const STORAGE_KEY = 'currentUser';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    // TODO: [SECURITY] Replace with JWT token validation in future
    const loadSession = () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEY);
        if (storedUser) {
          const user = JSON.parse(storedUser);
          // Only store id, username, and role
          setCurrentUser({
            id: user.id,
            username: user.username,
            role: user.role
          });
        }
      } catch (error) {
        console.error('Failed to load session:', error);
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  const login = (user) => {
    // Store only id, username, and role
    const safeUser = {
      id: user.id,
      username: user.username,
      role: user.role
    };
    setCurrentUser(safeUser);
    // TODO: [SECURITY] Store JWT token instead of user data in future
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY);
    // TODO: [SECURITY] Clear JWT token and call logout API in future
  };

  const refreshUsers = async () => {
    // This function is kept for backward compatibility with ManageUsers page
    try {
      await usersApi.getAll();
    } catch (error) {
      console.error('Failed to refresh users:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isLoading, refreshUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
