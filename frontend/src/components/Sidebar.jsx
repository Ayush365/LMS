import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiHome, FiCheckSquare, FiFileText, FiBarChart2, FiSettings, FiLogOut, FiCalendar, FiUsers, FiBook } from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-logo">
        <div className="logo-icon"></div>
        <span>LMS</span>
        <button className="mobile-close" onClick={closeSidebar}>×</button>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <FiHome className="nav-icon" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/tasks" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <FiCheckSquare className="nav-icon" />
          <span>Tasks</span>
        </NavLink>

        <NavLink to="/reports" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <FiFileText className="nav-icon" />
          <span>Reports</span>
        </NavLink>

        <NavLink to="/calendar" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <FiCalendar className="nav-icon" />
          <span>Calendar</span>
        </NavLink>

        {user.role === 'admin' && (
          <>
            <NavLink to="/analytics" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <FiBarChart2 className="nav-icon" />
              <span>Analytics</span>
            </NavLink>
            <NavLink to="/users" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <FiUsers className="nav-icon" />
              <span>Manage Users</span>
            </NavLink>
            <NavLink to="/courses" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <FiBook className="nav-icon" />
              <span>Manage Courses</span>
            </NavLink>
          </>
        )}

        <NavLink to="/settings" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <FiSettings className="nav-icon" />
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="nav-item" onClick={logout} style={{ cursor: 'pointer' }}>
          <FiLogOut className="nav-icon" />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
