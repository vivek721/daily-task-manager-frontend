import { createContext, useContext } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// Kept apart from AuthProvider (AuthContext.tsx) so that file only exports a component,
// which React Fast Refresh needs.
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
