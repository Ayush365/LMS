import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import './Dashboard.css';
import { AuthContext } from '../context/AuthContext';
import { FiPlus, FiFileText, FiVideo, FiLink, FiDownload, FiTrash2, FiBox, FiUpload } from 'react-icons/fi';

const CourseDetail = () => {
  const { courseId } = useParams();
  const { user } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [showModForm, setShowModForm] = useState(false);
  const [newModTitle, setNewModTitle] = useState('');
  const [uploadModId, setUploadModId] = useState(null);
  const [newMatTitle, setNewMatTitle] = useState('');
  const [newMatFile, setNewMatFile] = useState(null);

  const isInstructor = user?.role === 'teacher' || user?.is_admin;

  useEffect(() => {
    fetchDetails();
  }, [courseId]);

  const fetchDetails = async () => {
    try {
      const res = await api.get(`/courses/${courseId}`);
      setCourse(res.data);
      const modRes = await api.get(`/content/courses/${courseId}/modules`);
      setModules(modRes.data);
    } catch (err) {
      console.error("Failed to load details", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateModule = async () => {
    try {
      await api.post('/content/modules', { title: newModTitle, course_id: parseInt(courseId) });
      setNewModTitle('');
      setShowModForm(false);
      fetchDetails();
    } catch (err) {
      alert("Failed to create module");
    }
  };

  const handleUploadMaterial = async () => {
    if (!newMatFile) {
      alert("Please select a file to upload.");
      return;
    }
    const formData = new FormData();
    formData.append('title', newMatTitle || newMatFile.name);
    formData.append('material_type', 'PDF'); // Default
    formData.append('module_id', uploadModId);
    formData.append('file', newMatFile);

    try {
      await api.post('/content/materials', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setNewMatTitle('');
      setNewMatFile(null);
      setUploadModId(null);
      fetchDetails();
    } catch (err) {
      alert("Upload failed");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!course) return <div>Course not found.</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>{course.title}</h1>
          <p className="text-muted">{course.department} • {course.semester}</p>
        </div>
        {isInstructor && (
          <button className="btn btn-primary" onClick={() => setShowModForm(true)}><FiPlus /> Add Module</button>
        )}
      </header>

      {showModForm && (
        <div className="card glass-panel" style={{ marginBottom: '2rem' }}>
          <h3>New Module</h3>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Module Title" 
            value={newModTitle} 
            onChange={(e) => setNewModTitle(e.target.value)} 
          />
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={handleCreateModule}>Create</button>
            <button className="btn btn-secondary" onClick={() => setShowModForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="dashboard-main" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="course-content">
          <h2>Modules</h2>
          {modules.length === 0 ? (
            <p className="text-muted">No modules uploaded yet.</p>
          ) : (
            modules.map(module => (
              <div key={module.id} className="card glass-panel" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3>{module.title}</h3>
                  {isInstructor && (
                    <button className="btn btn-secondary btn-sm" onClick={() => setUploadModId(module.id)}><FiUpload /> Upload</button>
                  )}
                </div>

                {uploadModId === module.id && (
                  <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                    <label style={{ fontSize: '0.8rem', opacity: 0.7 }}>Title (optional)</label>
                    <input type="text" className="form-control" placeholder="e.g. Lecture Slides" value={newMatTitle} onChange={(e) => setNewMatTitle(e.target.value)} />
                    
                    <label style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.5rem', display: 'block' }}>Choose File</label>
                    <input type="file" className="form-control" onChange={(e) => setNewMatFile(e.target.files[0])} />
                    
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-primary btn-sm" onClick={handleUploadMaterial}>Confirm Upload</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => setUploadModId(null)}>Cancel</button>
                    </div>
                  </div>
                )}

                <div className="materials-list" style={{ marginTop: '1rem' }}>
                  {module.materials.map(material => (
                    <div key={material.id} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1rem', 
                      padding: '0.75rem', 
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '8px',
                      marginBottom: '0.5rem'
                    }}>
                      {material.material_type === 'VIDEO' ? <FiVideo /> : <FiFileText />}
                      <span>{material.title}</span>
                      <a 
                        href={`http://localhost:8000${material.file_path}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="btn btn-secondary btn-sm" 
                        style={{ marginLeft: 'auto', padding: '0.25rem 0.5rem' }}
                        onClick={() => api.get(`/content/materials/${material.id}/view`)}
                      >
                        <FiDownload />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="course-sidebar">
          <div className="card glass-panel">
            <h3>Course Info</h3>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '1rem' }}>
              {course.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
