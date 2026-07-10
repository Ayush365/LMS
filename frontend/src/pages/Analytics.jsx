import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import api from '../api';
import './Analytics.css';

const Analytics = () => {
  const [overview, setOverview] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [studentProgress, setStudentProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [overviewRes, perfRes, progressRes] = await Promise.all([
          api.get('/api/analytics/overview'),
          api.get('/api/analytics/performance'),
          api.get('/api/analytics/student-progress')
        ]);
        setOverview(overviewRes.data);
        setPerformance(perfRes.data);
        setStudentProgress(progressRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, []);

  if (loading) return <div>Loading analytics...</div>;

  // Format performance data for recharts
  const chartData = performance?.labels.map((label, index) => {
    const dataPoint = { name: label };
    performance.datasets.forEach(dataset => {
      dataPoint[dataset.label] = dataset.data[index];
    });
    return dataPoint;
  }) || [];

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1>System Analytics</h1>
        <p>Overview of platform performance and engagement.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <h3>Total Interns</h3>
          <div className="stat-value">{overview?.total_interns || 0}</div>
        </div>
        <div className="stat-card glass-panel">
          <h3>Total Tasks</h3>
          <div className="stat-value">{overview?.total_tasks || 0}</div>
        </div>
        <div className="stat-card glass-panel">
          <h3>Completion Rate</h3>
          <div className="stat-value">{overview?.completion_rate?.toFixed(1) || 0}%</div>
        </div>
        <div className="stat-card glass-panel">
          <h3>Reports Reviewed</h3>
          <div className="stat-value">{overview?.total_reviews || 0}</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container glass-panel">
          <h3>Department Performance</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#a0a0b0" />
                <YAxis stroke="#a0a0b0" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a2e', borderColor: '#2d2d44' }}
                />
                <Legend />
                <Bar dataKey="Task Completion" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="progress-section glass-panel">
        <h3>Student Progress Overview</h3>
        <div className="progress-table-wrapper">
          <table className="progress-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Total Tasks</th>
                <th>Completed</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {studentProgress.map(student => (
                <tr key={student.id}>
                  <td>
                    <div className="student-cell">
                      <div className="student-avatar">{student.name[0]}</div>
                      <div>
                        <div className="student-name">{student.name}</div>
                        <div className="student-email">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{student.total_tasks}</td>
                  <td>{student.completed_tasks}</td>
                  <td>
                    <div className="progress-bar-container">
                      <div className="progress-bar-fill" style={{ width: `${student.completion_rate}%` }}></div>
                      <span>{student.completion_rate.toFixed(0)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
