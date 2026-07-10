import React, { useState, useEffect } from 'react';
import api from '../api';
import { FiUsers, FiUserPlus, FiTrash2, FiShield } from 'react-icons/fi';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/api/users');
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div className="loading-screen">Loading users...</div>;

  return (
    <div className="user-mgmt-container">
      <div className="mgmt-header">
        <h1>User Management</h1>
        <button className="btn btn-primary">
          <FiUserPlus /> Add New User
        </button>
      </div>

      <div className="users-grid glass-panel">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>#{user.id}</td>
                <td>
                  <div className="user-info-cell">
                    <div className="user-avatar-mini">{user.name[0]}</div>
                    {user.name}
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge role-${user.role}`}>
                    {user.role === 'admin' && <FiShield style={{ marginRight: '4px' }} />}
                    {user.role}
                  </span>
                </td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="Edit"><FiUserPlus /></button>
                    <button className="btn-icon btn-delete" title="Delete"><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
