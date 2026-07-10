import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FiBookOpen, FiClock, FiShield, FiUsers, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import './LandingPage.css';

const LandingPage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="badge-new">NEW: Smart Planner 2.0 is here</div>
          <h1 className="hero-title">
            The Next Generation <span className="text-gradient">Learning Management</span> System
          </h1>
          <p className="hero-subtitle">
            A complete platform for students and teachers to organize content, track progress, and achieve academic excellence with ease.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">Go to Dashboard <FiArrowRight /></Link>
            ) : (
              <Link to="/login" className="btn btn-primary btn-lg">Get Started <FiArrowRight /></Link>
            )}
            {/* <Link to="/catalog" className="btn btn-secondary btn-lg">Explore Courses</Link> */}
          </div>
        </div>
        <div className="hero-visual">
          <div className="glass-card hero-preview">
            <div className="preview-header">
              <div className="dot red"></div>
              <div className="dot yellow"></div>
              <div className="dot green"></div>
            </div>
            <div className="preview-content">
              <div className="skeleton title"></div>
              <div className="skeleton text"></div>
              <div className="skeleton text short"></div>
              <div className="preview-stats">
                <div className="skeleton circle"></div>
                <div className="skeleton circle"></div>
                <div className="skeleton circle"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Built for Modern Education</h2>
        <div className="features-grid">
          <div className="feature-card glass-panel">
            <div className="feature-icon"><FiClock /></div>
            <h3>Smart Planning</h3>
            <p>Automatically prioritize your tasks and track your study streaks with our intelligent scheduling system.</p>
          </div>
          <div className="feature-card glass-panel">
            <div className="feature-icon"><FiBookOpen /></div>
            <h3>Content Management</h3>
            <p>Upload and organize materials into modules. Support for PDFs, videos, and interactive links.</p>
          </div>
          <div className="feature-card glass-panel">
            <div className="feature-icon"><FiShield /></div>
            <h3>Secure RBAC</h3>
            <p>Enterprise-grade Role-Based Access Control ensures data privacy and role-specific workflows.</p>
          </div>
          <div className="feature-card glass-panel">
            <div className="feature-icon"><FiUsers /></div>
            <h3>Collaboration</h3>
            <p>Direct integration between students and teachers for enrollment, feedback, and resource sharing.</p>
          </div>
        </div>
      </section>

      {/* Role Breakdown */}
      <section className="roles-section">
        <div className="role-content">
          <h2 className="section-title">One Platform, Three Experiences</h2>
          <div className="roles-list">
            <div className="role-item">
              <div className="role-icon"><FiCheckCircle /></div>
              <div>
                <h4>For Students</h4>
                <p>Personalized dashboards, daily task planning, and easy access to course materials.</p>
              </div>
            </div>
            <div className="role-item">
              <div className="role-icon"><FiCheckCircle /></div>
              <div>
                <h4>For Teachers</h4>
                <p>Powerful course creation, module organization, and automated student tracking.</p>
              </div>
            </div>
            <div className="role-item">
              <div className="role-icon"><FiCheckCircle /></div>
              <div>
                <h4>For Admins</h4>
                <p>Full system analytics, user management, and centralized resource control.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="role-visual">
          {/* Mock visual element */}
          <div className="floating-elements">
            <div className="float-card c1">124 Courses</div>
            <div className="float-card c2">8.2k Students</div>
            <div className="float-card c3">99.9% Uptime</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-card glass-panel">
          <h2>Ready to transform your learning experience?</h2>
          <p>Join thousands of users who are already excelling with our platform.</p>
          <Link to="/login" className="btn btn-primary btn-lg">Create Free Account</Link>
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2026 LMS Smart Planner. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
