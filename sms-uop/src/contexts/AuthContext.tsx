import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import apiService from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, role: string, faculty?: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to check if the user is currently logged in via session cookie
  const checkAuthStatus = async () => {
    try {
      // We don't set loading true here to avoid flickering on navigations
      const response = await apiService.admin.getCurrentUser();
      if (response.data && response.data.email) {
        setUser(response.data);
        setError(null);
      }
    } catch (err) {
      // If 401 or 403, user is not logged in
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Check authentication on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (email: string, role: string, faculty?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.auth.login({ email, role, faculty });
      if (response.data) {
        setUser(response.data);
      }
    } catch (err: any) {
      console.error('Login failed', err);
      setError(err.response?.data || 'Authentication failed');
      throw err; // Re-throw to let component handle it
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiService.auth.logout();
      setUser(null);
      // Optional: Redirect to home page
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed', err);
      setUser(null);
    }
  };

  const isAuthenticated = !!user;
  // Check if user has one of the admin roles
  const isAdmin = user?.role !== undefined &&
      ['dean', 'assistant_registrar', 'vice_chancellor', 'student_service', 'premises_officer'].includes(user.role.toLowerCase());

  return (
      <AuthContext.Provider value={{
        user,
        login,
        logout,
        isAuthenticated,
        isAdmin,
        loading,
        error,
        checkAuthStatus
      }}>
        {children}
      </AuthContext.Provider>
  );
};