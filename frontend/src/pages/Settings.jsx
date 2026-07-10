import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { FiUser, FiBell, FiSun, FiLock, FiSave } from 'react-icons/fi';
import api from '../api';
import './Settings.css';

const Settings = () => {
  const { user } = useContext(AuthContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [successMsg, setSuccessMsg] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put('/api/users/me/', { name, email });
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      // In a real app we'd also update the context user here or re-fetch /me
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account preferences and system settings.</p>
      </div>

      <div className="settings-layout">
        <div className="settings-sidebar glass-panel">
          <nav className="settings-nav">
            <button 
              className={`settings-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <FiUser /> Profile
            </button>
            <button 
              className={`settings-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <FiBell /> Notifications
            </button>
            <button 
              className={`settings-nav-item ${activeTab === 'appearance' ? 'active' : ''}`}
              onClick={() => setActiveTab('appearance')}
            >
              <FiSun /> Appearance
            </button>
            <button 
              className={`settings-nav-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <FiLock /> Security
            </button>
          </nav>
        </div>

        <div className="settings-content glass-panel">
          {activeTab === 'profile' && (
            <div className="settings-section">
              <h2>Profile Information</h2>
              <div className="profile-avatar-upload">
                <div className="avatar-large">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <button className="btn btn-outline">Change Avatar</button>
              </div>
              {successMsg && <div className="success-message" style={{color: 'var(--accent-success)', marginBottom: '1rem'}}>{successMsg}</div>}
              <form className="settings-form" onSubmit={handleUpdateProfile}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <input type="text" className="input-field" defaultValue={user?.role} disabled />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary"><FiSave /> Save Changes</button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h2>Theme Preferences</h2>
              <div className="theme-options">
                <div className={`theme-card ${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')}>
                  <div className="theme-preview dark"></div>
                  <span>Dark Mode</span>
                </div>
                <div className={`theme-card ${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')}>
                  <div className="theme-preview light"></div>
                  <span>Light Mode</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>Notification Preferences</h2>
              <div className="toggle-list">
                <div className="toggle-item">
                  <div className="toggle-info">
                    <h4>Email Notifications</h4>
                    <p>Receive daily summaries of your tasks.</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider round"></span>
                  </label>
                </div>
                <div className="toggle-item">
                  <div className="toggle-info">
                    <h4>Task Updates</h4>
                    <p>Get notified when a task status changes.</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
