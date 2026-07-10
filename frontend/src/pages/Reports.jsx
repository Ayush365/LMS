import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { FiEdit3, FiEye, FiColumns, FiSend, FiUpload } from 'react-icons/fi';
import './Reports.css';

const Reports = () => {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [content, setContent] = useState('# Weekly Update\n\n- Completed tasks: \n- Blockers: \n- Next steps: ');
  const [viewMode, setViewMode] = useState('split'); // edit, preview, split
  const [feedbackInputs, setFeedbackInputs] = useState({});
  
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await api.get('/api/reports');
      setReports(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitReport = async () => {
    try {
      await api.post('/api/reports', { content });
      setContent('# Weekly Update\n\n- Completed tasks: \n- Blockers: \n- Next steps: ');
      fetchReports();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      await api.post('/api/reports/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchReports();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReview = async (reportId) => {
    try {
      await api.post(`/api/reports/${reportId}/review`, { feedback: feedbackInputs[reportId] });
      fetchReports();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading reports...</div>;

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>Progress Reports</h1>
        <p>Submit your weekly progress and receive feedback.</p>
      </div>

      <div className="report-editor-section glass-panel">
        <div className="editor-toolbar">
          <div className="toolbar-group">
            <button 
              className={`toolbar-btn ${viewMode === 'edit' ? 'active' : ''}`}
              onClick={() => setViewMode('edit')}
            >
              <FiEdit3 /> Edit
            </button>
            <button 
              className={`toolbar-btn ${viewMode === 'preview' ? 'active' : ''}`}
              onClick={() => setViewMode('preview')}
            >
              <FiEye /> Preview
            </button>
            <button 
              className={`toolbar-btn ${viewMode === 'split' ? 'active' : ''}`}
              onClick={() => setViewMode('split')}
            >
              <FiColumns /> Split
            </button>
          </div>
          <div className="toolbar-actions">
            <label className="btn btn-secondary upload-btn">
              <FiUpload /> Upload File
              <input type="file" onChange={handleUpload} style={{ display: 'none' }} />
            </label>
            <button className="btn btn-primary" onClick={submitReport}>
              <FiSend /> Submit Report
            </button>
          </div>
        </div>

        <div className={`editor-workspace mode-${viewMode}`}>
          {(viewMode === 'edit' || viewMode === 'split') && (
            <textarea
              className="markdown-input"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your report in markdown..."
            />
          )}
          
          {(viewMode === 'preview' || viewMode === 'split') && (
            <div className="markdown-preview">
              <pre>{content}</pre>
              {/* In a real app, use react-markdown to render */}
            </div>
          )}
        </div>
      </div>

      <div className="reports-history">
        <h2>Past Reports</h2>
        <div className="reports-list">
          {reports.map(report => (
            <div key={report.id} className="report-card">
              <div className="report-meta">
                <span className={`status-badge ${report.status.toLowerCase()}`}>
                  {report.status}
                </span>
                <span className="date">
                  {new Date(report.submitted_at).toLocaleDateString()}
                </span>
              </div>
              <div className="report-content-preview">
                <pre>{report.content}</pre>
              </div>
              {report.feedback && (
                <div className="report-feedback">
                  <strong>Feedback:</strong>
                  <p>{report.feedback}</p>
                </div>
              )}
              {user.role === 'admin' && report.status === 'Pending' && (
                <div className="admin-review-section">
                  <textarea 
                    className="input-field" 
                    placeholder="Enter feedback..." 
                    value={feedbackInputs[report.id] || ''}
                    onChange={(e) => setFeedbackInputs({...feedbackInputs, [report.id]: e.target.value})}
                  />
                  <button className="btn btn-primary" onClick={() => handleReview(report.id)}>
                    Submit Review
                  </button>
                </div>
              )}
            </div>
          ))}
          {reports.length === 0 && <p>No reports submitted yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default Reports;
