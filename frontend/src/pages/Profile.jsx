import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import './Dashboard.css';
import { FiUser, FiMail, FiEdit2, FiSave } from 'react-icons/fi';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    bio: user?.bio || '',
  });

  const handleSave = async () => {
    try {
      const res = await api.put('/users/me/', formData);
      setUser(res.data);
      setEditing(false);
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Your Profile</h1>
      </header>

      <div className="dashboard-main" style={{ gridTemplateColumns: '1fr' }}>
        <div className="card glass-panel">
          <div className="profile-header" style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
            <div className="profile-avatar" style={{ 
              width: '100px', 
              height: '100px', 
              borderRadius: '50%', 
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              color: 'white'
            }}>
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2>{user?.username}</h2>
              <p className="text-muted" style={{ textTransform: 'capitalize' }}>Role: {user?.role}</p>
            </div>
            {!editing && (
              <button className="btn btn-secondary" style={{ marginLeft: 'auto' }} onClick={() => setEditing(true)}>
                <FiEdit2 /> Edit Profile
              </button>
            )}
          </div>

          <div className="profile-info">
            <div className="form-group">
              <label><FiMail /> Email Address</label>
              {editing ? (
                <input 
                  type="email" 
                  className="form-control" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              ) : (
                <p>{user?.email}</p>
              )}
            </div>

            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label>Bio</label>
              {editing ? (
                <textarea 
                  className="form-control" 
                  rows="4"
                  value={formData.bio} 
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                />
              ) : (
                <p>{user?.bio || 'No bio yet.'}</p>
              )}
            </div>

            {editing && (
              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <button className="btn btn-primary" onClick={handleSave}><FiSave /> Save Changes</button>
                <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
