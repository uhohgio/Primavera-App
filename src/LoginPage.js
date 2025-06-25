// CustomAuthPage.js
import React, { useState } from 'react';
import { supabase } from './supabaseClient'; // Your existing Supabase client

// Basic styles to mimic ThemeSupa (dark theme with burlywood accents)
const containerStyle = {
  padding: '40px',
  maxWidth: '400px',
  margin: '40px auto',
  backgroundColor: '#222', // Dark background
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  color: '#eee', // Light text
  fontFamily: 'sans-serif',
};

const tabContainerStyle = {
  display: 'flex',
  marginBottom: '20px',
  borderRadius: '4px',
  overflow: 'hidden',
  backgroundColor: '#333',
};

const tabButtonStyle = {
  flex: '1',
  padding: '12px 0',
  textAlign: 'center',
  cursor: 'pointer',
  border: 'none',
  backgroundColor: 'transparent',
  color: '#aaa',
  fontSize: '16px',
  fontWeight: 'bold',
  transition: 'background-color 0.3s ease, color 0.3s ease',
};

const activeTabButtonStyle = {
  ...tabButtonStyle,
  backgroundColor: 'burlywood', // Brand color
  color: '#222', // Dark text on brand color
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
};

const inputStyle = {
  padding: '12px',
  borderRadius: '4px',
  border: '1px solid #555',
  backgroundColor: '#333',
  color: '#eee',
  fontSize: '16px',
  outline: 'none',
};

const passwordContainerStyle = {
  position: 'relative',
};

const passwordToggleStyle = {
  position: 'absolute',
  right: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  cursor: 'pointer',
  color: '#aaa',
  fontSize: '1.2em',
};

const buttonStyle = {
  padding: '12px',
  borderRadius: '4px',
  border: 'none',
  backgroundColor: 'burlywood', // Brand color
  color: '#222', // Dark text
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease, opacity 0.3s ease',
};

const buttonDisabledStyle = {
  ...buttonStyle,
  opacity: '0.6',
  cursor: 'not-allowed',
};

const messageStyle = {
  padding: '10px',
  borderRadius: '4px',
  marginTop: '15px',
  fontSize: '14px',
};

const errorMessageStyle = {
  ...messageStyle,
  backgroundColor: '#f4433622', // Light red background
  color: '#f44336', // Red text
};

const successMessageStyle = {
  ...messageStyle,
  backgroundColor: '#4CAF5022', // Light green background
  color: '#4CAF50', // Green text
};

export default function CustomAuthPage() {
  const [activeTab, setActiveTab] = useState('signIn'); // 'signIn' or 'signUp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }

  const handleAuth = async (isSignUp) => {
    setLoading(true);
    setMessage(null);

    let authPromise;
    if (isSignUp) {
      authPromise = supabase.auth.signUp({ email, password });
    } else {
      authPromise = supabase.auth.signInWithPassword({ email, password });
    }

    const { error } = await authPromise;

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      if (isSignUp) {
        setMessage({ type: 'success', text: 'Check your email for the confirmation link!' });
      } else {
        setMessage({ type: 'success', text: 'Logged in successfully!' });
        // Optional: Redirect user after successful login
        // window.location.href = '/dashboard';
      }
      setEmail('');
      setPassword('');
    }
    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div style={containerStyle}>
      <div style={tabContainerStyle}>
        <button
          style={activeTab === 'signIn' ? activeTabButtonStyle : tabButtonStyle}
          onClick={() => setActiveTab('signIn')}
        >
          Sign In
        </button>
        <button
          style={activeTab === 'signUp' ? activeTabButtonStyle : tabButtonStyle}
          onClick={() => setActiveTab('signUp')}
        >
          Sign Up
        </button>
      </div>

      {message && (
        <div style={message.type === 'error' ? errorMessageStyle : successMessageStyle}>
          {message.text}
        </div>
      )}

      {activeTab === 'signIn' && (
        <form onSubmit={(e) => { e.preventDefault(); handleAuth(false); }} style={formStyle}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />
          <div style={passwordContainerStyle}>
            <input
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              required
            />
            <span onClick={togglePasswordVisibility} style={passwordToggleStyle}>
              {passwordVisible ? '🙈' : '👁️'}
            </span>
          </div>
          <button type="submit" disabled={loading} style={loading ? buttonDisabledStyle : buttonStyle}>
            {loading ? 'Loading...' : 'Sign In'}
          </button>
        </form>
      )}

      {activeTab === 'signUp' && (
        <form onSubmit={(e) => { e.preventDefault(); handleAuth(true); }} style={formStyle}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />
          <div style={passwordContainerStyle}>
            <input
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              required
            />
            <span onClick={togglePasswordVisibility} style={passwordToggleStyle}>
              {passwordVisible ? '🙈' : '👁️'}
            </span>
          </div>
          <button type="submit" disabled={loading} style={loading ? buttonDisabledStyle : buttonStyle}>
            {loading ? 'Loading...' : 'Sign Up'}
          </button>
        </form>
      )}
    </div>
  );
}