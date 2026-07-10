import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiCheckSquare, FiClock, FiFileText, FiActivity } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [overview, setOverview] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [overviewRes, activityRes] = await Promise.all([
          api.get('/api/analytics/overview'),
          api.get('/api/analytics/activity') 
        ]);
        setOverview(overviewRes.data);
        
        // Use real activity logs
        const formattedActivities = activityRes.data.map(log => ({
          id: log.id,
          action: log.action,
          time: new Date(log.timestamp).toLocaleString()
        }));
        setActivities(formattedActivities);
        
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) return <div className="loading-screen">Loading dashboard...</div>;

  const chartData = [
    { name: 'Mon', completion: 40 },
    { name: 'Tue', completion: 55 },
    { name: 'Wed', completion: 45 },
    { name: 'Thu', completion: 70 },
    { name: 'Fri', completion: 65 },
    { name: 'Sat', completion: 80 },
    { name: 'Sun', completion: 85 },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}!</h1>
        <p>Here's what's happening with your projects today.</p>
      </div>

      <div className="stats-cards">
        <div className="stat-card-modern">
          <div className="stat-icon-wrapper">
            <FiCheckSquare className="stat-icon" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Tasks</span>
            <span className="stat-number">{overview?.total_tasks || 0}</span>
          </div>
        </div>
        
        <div className="stat-card-modern">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <FiActivity className="stat-icon" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Completion Rate</span>
            <span className="stat-number">{overview?.completion_rate?.toFixed(0) || 0}%</span>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <FiFileText className="stat-icon" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Reports Reviewed</span>
            <span className="stat-number">{overview?.total_reviews || 0}</span>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' }}>
            <FiClock className="stat-icon" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Active Interns</span>
            <span className="stat-number">{overview?.total_interns || 0}</span>
          </div>
        </div>
      </div>

      <div className="dashboard-main-grid">
        <div className="chart-section glass-panel">
          <div className="section-header">
            <h3>Performance Trends</h3>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="completion" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="activity-section glass-panel">
          <div className="section-header">
            <h3>Recent Activity</h3>
          </div>
          <div className="activity-list">
            {activities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-dot"></div>
                <div className="activity-content">
                  <p>{activity.action}</p>
                  <span>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
