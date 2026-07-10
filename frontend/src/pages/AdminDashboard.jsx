import React, { useState, useEffect } from 'react';
import api from '../api';
import './Dashboard.css'; // Reuse dashboard styles where possible
import { FiUsers, FiBook, FiList } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    total_courses: 0,
    total_tasks: 0
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load admin stats", err);
      }
    };
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };
    fetchStats();
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/admin/users/${userId}`);
        setUsers(users.filter(u => u.id !== userId));
        alert("User deleted successfully.");
      } catch (err) {
        console.error("Failed to delete user", err);
        alert("Failed to delete user. They may have related data (courses/tasks) preventing deletion.");
      }
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Admin Control Panel</h1>
            <p className="text-muted">System-wide overview and management.</p>
          </div>
          <button className="btn btn-primary" onClick={async () => {
            try {
              await api.post('/admin/backup');
              alert("Backup created successfully (backup.json)");
            } catch (err) {
              alert("Backup failed");
            }
          }}>
            Create System Backup
          </button>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{color: 'var(--accent-primary)'}}><FiUsers /></div>
          <div className="stat-info">
            <h3>{stats.total_users}</h3>
            <p>Total Registered Users</p>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{color: 'var(--accent-secondary)'}}><FiBook /></div>
          <div className="stat-info">
            <h3>{stats.total_courses}</h3>
            <p>Total Courses Created</p>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{color: 'var(--accent-success)'}}><FiList /></div>
          <div className="stat-info">
            <h3>{stats.total_tasks}</h3>
            <p>Total Tasks Tracked</p>
          </div>
        </div>
      </div>

      <div className="dashboard-main" style={{ gridTemplateColumns: '1fr' }}>
        <div className="card glass-panel">
          <h2 className="card-title">User Management</h2>
          <div className="table-responsive" style={{ marginTop: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '1rem' }}>Username</th>
                  <th style={{ padding: '1rem' }}>Email</th>
                  <th style={{ padding: '1rem' }}>Role</th>
                  <th style={{ padding: '1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem' }}>{u.username}</td>
                    <td style={{ padding: '1rem' }}>{u.email}</td>
                    <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{u.role}</td>
                    <td style={{ padding: '1rem' }}>
                      <button 
                        className="btn btn-secondary btn-sm" 
                        style={{ color: 'var(--accent-error)' }}
                        onClick={() => handleDeleteUser(u.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
