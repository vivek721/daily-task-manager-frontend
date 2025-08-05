import React, { useState } from 'react';
import GoogleLoginButton from './GoogleLogin';
import DevLogin from './DevLogin';
import SignUp from './SignUp';
import SignIn from './SignIn';

type AuthMode = 'local' | 'oauth';
type LocalAuthMode = 'signin' | 'signup';

const LoginPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<AuthMode>('local');
  const [localAuthMode, setLocalAuthMode] = useState<LocalAuthMode>('signin');


  const toggleLocalAuthMode = () => {
    setLocalAuthMode(prev => prev === 'signin' ? 'signup' : 'signin');
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '500px',
        textAlign: 'center'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '32px'
        }}>
          <h1 style={{
            marginBottom: '8px',
            fontSize: '32px',
            fontWeight: '700',
            color: 'white',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            Daily Task Manager
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.9)',
            lineHeight: '1.5'
          }}>
            Organize your tasks, boost your productivity
          </p>
        </div>

        {/* Auth Mode Toggle */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '8px',
          marginBottom: '24px',
          display: 'flex',
          gap: '8px'
        }}>
          <button
            onClick={() => setAuthMode('local')}
            style={{
              flex: 1,
              padding: '12px 24px',
              background: authMode === 'local' ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
              color: authMode === 'local' ? '#333' : 'rgba(255, 255, 255, 0.8)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Username & Password
          </button>
          <button
            onClick={() => setAuthMode('oauth')}
            style={{
              flex: 1,
              padding: '12px 24px',
              background: authMode === 'oauth' ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
              color: authMode === 'oauth' ? '#333' : 'rgba(255, 255, 255, 0.8)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Google OAuth
          </button>
        </div>

        {/* Auth Forms */}
        {authMode === 'local' ? (
          localAuthMode === 'signin' ? (
            <SignIn onToggleMode={toggleLocalAuthMode} />
          ) : (
            <SignUp onToggleMode={toggleLocalAuthMode} />
          )
        ) : (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '48px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h2 style={{
              marginBottom: '24px',
              fontSize: '24px',
              fontWeight: '600',
              color: '#333'
            }}>
              Sign in with Google
            </h2>
            <p style={{
              marginBottom: '32px',
              fontSize: '16px',
              color: '#666',
              lineHeight: '1.5'
            }}>
              Use your Google account to access your task management dashboard
            </p>
            
            <DevLogin />
            <GoogleLoginButton />
            
            <p style={{
              marginTop: '24px',
              fontSize: '14px',
              color: '#888',
              lineHeight: '1.4'
            }}>
              By signing in, you agree to securely store your tasks and account information.
            </p>
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: '24px',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.7)',
            lineHeight: '1.4'
          }}>
            Secure authentication • Data encryption • Privacy protected
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;