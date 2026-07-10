import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { FiBell, FiMoon, FiSun, FiMenu, FiShield } from 'react-icons/fi';
import api from '../api';
import './Header.css';

const Header = ({ toggleSidebar }) => {
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/api/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <header className="header">
      <div className="header-left">
        <button className="icon-btn mobile-toggle" onClick={toggleSidebar}>
          <FiMenu />
        </button>
        <div className="header-search">
          {/* Search could go here */}
        </div>
      </div>

      <div className="header-actions">
        <div className="notification-wrapper">
          <button className="icon-btn" onClick={() => setShowNotifs(!showNotifs)}>
            <FiBell />
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </button>
          
          {showNotifs && (
            <div className="notification-dropdown glass-panel">
              <div className="dropdown-header">
                <h3>Notifications</h3>
              </div>
              <div className="notification-list">
                {notifications.length > 0 ? notifications.map(notif => (
                  <div key={notif.id} className={`notification-item ${notif.is_read ? 'read' : 'unread'}`} onClick={() => markAsRead(notif.id)}>
                    <p>{notif.message}</p>
                  </div>
                )) : <p className="empty-notif">No notifications</p>}
              </div>
            </div>
          )}
        </div>
        <button className="icon-btn" onClick={toggleTheme}>
          {theme === 'dark' ? <FiSun /> : <FiMoon />}
        </button>
        <div className="user-profile">
          <div className="avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-info">
            <div className="name-wrapper">
              <span className="user-name">{user.name}</span>
              {user.role === 'admin' && <span className="admin-badge"><FiShield size={10} /> Admin</span>}
            </div>
            <span className="user-role">{user.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
