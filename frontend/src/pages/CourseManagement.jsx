import React, { useState, useEffect } from 'react';
import api from '../api';
import { FiBook, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import './CourseManagement.css';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/api/courses/all');
        setCourses(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <div className="loading-screen">Loading courses...</div>;

  return (
    <div className="course-mgmt-container">
      <div className="mgmt-header">
        <h1>Course Management</h1>
        <button className="btn btn-primary">
          <FiPlus /> Create New Course
        </button>
      </div>

      <div className="courses-grid-admin">
        {courses.map(course => (
          <div key={course.id} className="course-card-admin glass-panel">
            <div className="course-thumb">
               {course.thumbnail ? <img src={course.thumbnail} alt={course.title} /> : <div className="no-thumb"><FiBook size={40} /></div>}
            </div>
            <div className="course-info">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div className="course-meta">
                <span>Owner ID: {course.owner_id}</span>
                <div className="action-btns">
                  <button className="btn-icon"><FiEdit2 /></button>
                  <button className="btn-icon btn-delete"><FiTrash2 /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseManagement;
