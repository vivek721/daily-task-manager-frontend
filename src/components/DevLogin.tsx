import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const DevLogin: React.FC = () => {
  const { login } = useAuth();

  const handleDevLogin = async () => {
    try {
      const response = await fetch('/api/auth/dev-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token);
      } else {
        console.error('Dev login failed:', await response.text());
      }
    } catch (error) {
      console.error('Dev login error:', error);
    }
  };

  // Only show in development (using Vite's import.meta.env)
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <button
      onClick={handleDevLogin}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '12px 24px',
        backgroundColor: '#f59e0b',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        minWidth: '200px',
        marginBottom: '16px'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = '#d97706';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = '#f59e0b';
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
      Dev Login (Test User)
    </button>
  );
};

export default DevLogin;