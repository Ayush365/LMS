import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './Dashboard.css';
import { FiSearch, FiBook, FiExternalLink } from 'react-icons/fi';

const CourseCatalog = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses/all');
        setCourses(res.data);
      } catch (err) {
        console.error("Failed to load catalog", err);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.subject?.toLowerCase().includes(search.toLowerCase())
  );

  const handleEnroll = async (courseId) => {
    try {
      await api.post(`/courses/${courseId}/enroll`);
      alert("Enrolled successfully!");
    } catch (err) {
      console.error("Enrollment failed", err);
      alert("Failed to enroll.");
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Course Catalog</h1>
        <div className="search-bar glass-panel" style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 1rem', width: '300px' }}>
          <FiSearch className="text-muted" />
          <input 
            type="text" 
            placeholder="Search courses..." 
            style={{ background: 'transparent', border: 'none', color: 'white', marginLeft: '0.5rem', outline: 'none', width: '100%' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <div className="course-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '1.5rem',
        marginTop: '2rem'
      }}>
        {filteredCourses.map(course => (
          <div key={course.id} className="card glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3 style={{ margin: 0 }}>{course.title}</h3>
              <span className="badge" style={{ background: 'var(--accent-secondary)' }}>{course.subject || 'LMS'}</span>
            </div>
            <p className="text-muted" style={{ margin: '1rem 0', flex: 1 }}>{course.description || 'No description available.'}</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleEnroll(course.id)}>Enroll Now</button>
              <Link to={`/courses/${course.id}`} className="btn btn-secondary"><FiExternalLink /></Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseCatalog;
