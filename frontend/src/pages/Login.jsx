import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import './Login.css';

const Login = () => {
  const { login, register } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed');
    }
  };

  const handleDemoLogin = async (role) => {
    try {
      const demoEmail = role === 'admin' ? 'admin@example.com' : 'student@example.com';
      await login(demoEmail, '1234');
    } catch (err) {
      setError('Demo login failed');
    }
  };

  return (
    <div className="login-container">
      <motion.div 
        className="login-card glass-panel"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h1 className="login-title">
          {isLogin ? 'Welcome Back' : 'Join LMS Platform'}
        </h1>
        <p className="login-subtitle">
          {isLogin ? 'Enter your details to access your dashboard.' : 'Create an account to start tracking.'}
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="form-group">
              <label>Name</label>
              <input 
                type="text" 
                className="input-field"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                placeholder="Enter full name"
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              className="input-field"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="Enter email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="input-field"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="Enter password"
            />
          </div>

          <button type="submit" className="btn btn-primary login-btn">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="demo-credentials">
          <p>Demo Credentials:</p>
          <div className="demo-buttons">
            <button type="button" className="btn btn-outline" onClick={() => handleDemoLogin('admin')}>Admin</button>
            <button type="button" className="btn btn-outline" onClick={() => handleDemoLogin('student')}>Student</button>
          </div>
        </div>

        <div className="login-toggle">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Create one' : 'Log in'}
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
