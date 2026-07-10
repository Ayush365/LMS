import React, { useState, useEffect } from 'react';
import api from '../api';
import './Dashboard.css';
import { FiCalendar, FiClock, FiPlus } from 'react-icons/fi';

const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', event_type: 'Event', start_time: '', description: '' });

  const fetchEvents = async () => {
    try {
      const res = await api.get('/calendar/events');
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to load events", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      await api.post('/calendar/events', newEvent);
      setShowForm(false);
      setNewEvent({ title: '', event_type: 'Event', start_time: '', description: '' });
      fetchEvents();
    } catch (err) {
      alert("Failed to add event");
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Academic Calendar</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}><FiPlus /> Add Event</button>
      </header>

      {showForm && (
        <div className="card glass-panel" style={{ marginBottom: '2rem' }}>
          <h3>Add New Event</h3>
          <form onSubmit={handleAddEvent} className="form-stack" style={{ marginTop: '1rem' }}>
            <input type="text" className="input-field" placeholder="Event Title" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} required />
            <select className="input-field" value={newEvent.event_type} onChange={e => setNewEvent({...newEvent, event_type: e.target.value})}>
              <option value="Event">General Event</option>
              <option value="Exam">Exam</option>
              <option value="Deadline">Deadline</option>
            </select>
            <input type="datetime-local" className="input-field" value={newEvent.start_time} onChange={e => setNewEvent({...newEvent, start_time: e.target.value})} required />
            <textarea className="input-field" placeholder="Description" value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} />
            <button type="submit" className="btn btn-primary">Save Event</button>
          </form>
        </div>
      )}

      <div className="dashboard-main" style={{ gridTemplateColumns: '1fr' }}>
        <div className="card glass-panel">
          <div className="calendar-legend" style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-primary)' }}></span>
              <span>Exams</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-secondary)' }}></span>
              <span>Deadlines</span>
            </div>
          </div>

          <div className="events-list">
            {events.length === 0 ? (
              <p className="text-muted">No events scheduled.</p>
            ) : (
              events.map(event => (
                <div key={event.id} className="event-item" style={{ 
                  padding: '1.5rem', 
                  borderLeft: `4px solid ${event.event_type.toLowerCase() === 'exam' ? 'var(--accent-primary)' : 'var(--accent-secondary)'}`,
                  background: 'rgba(255,255,255,0.03)',
                  marginBottom: '1rem',
                  borderRadius: '0 8px 8px 0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0 }}>{event.title}</h3>
                    <span className="text-muted"><FiClock /> {new Date(event.start_time).toLocaleDateString()}</span>
                  </div>
                  <p className="text-muted">{event.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
