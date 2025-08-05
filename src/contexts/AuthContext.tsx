import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Debug logging for user state changes
  useEffect(() => {
    console.log('User state changed:', user);
    console.log('Is authenticated:', !!user);
    console.log('Loading state:', loading);
  }, [user, loading]);

  const login = (token: string) => {
    console.log('Login called with token:', token.substring(0, 20) + '...');
    localStorage.setItem('authToken', token);
    verifyToken(token);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const verifyToken = async (token: string) => {
    console.log('Verifying token...', token.substring(0, 20) + '...');
    try {
      const response = await fetch('http://localhost:3001/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Token verification response:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('Token verification successful:', data);
        setUser(data.user);
      } else {
        console.log('Token verification failed, removing token');
        localStorage.removeItem('authToken');
        setUser(null);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('authToken');
      setUser(null);
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};