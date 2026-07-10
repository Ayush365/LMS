import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';
import { FiLogOut, FiUser, FiActivity, FiBell, FiSettings } from 'react-icons/fi';
import api from '../api';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
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

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-brand">
        <FiActivity className="brand-icon" />
        <Link to="/dashboard">Smart Planner</Link>
      </div>
      <div className="navbar-menu">
        {user ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/tasks" className="nav-link">Tasks</Link>
            <Link to="/reports" className="nav-link">Reports</Link>
            <Link to="/calendar" className="nav-link">Calendar</Link>
            {user.role === 'admin' && (
              <Link to="/analytics" className="nav-link">Analytics</Link>
            )}
            
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

            <Link to="/settings" className="nav-link icon-link"><FiSettings /></Link>
            
            <div className="user-profile">
              <FiUser className="user-icon" />
              <span>{user.name}</span>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={logout}>
              <FiLogOut /> Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm">Sign In</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
