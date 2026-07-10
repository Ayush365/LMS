import React, { useState, useEffect } from 'react';
import { FiPlus, FiCalendar, FiClock } from 'react-icons/fi';
import api from '../api';
import './Calendar.css';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start_time: '',
    end_time: '',
    description: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/api/calendar/events');
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newEvent,
        start_time: new Date(newEvent.start_time).toISOString(),
        end_time: new Date(newEvent.end_time).toISOString()
      };
      await api.post('/api/calendar/events', payload);
      setShowModal(false);
      setNewEvent({ title: '', start_time: '', end_time: '', description: '' });
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <h1>Schedules & Events</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FiPlus /> Add Event
        </button>
      </div>

      <div className="events-grid">
        {events.length > 0 ? events.map(event => (
          <div key={event.id} className="event-card glass-panel">
            <div className="event-icon">
              <FiCalendar />
            </div>
            <div className="event-info">
              <h3>{event.title}</h3>
              <p className="event-time">
                <FiClock /> {new Date(event.start_time).toLocaleString()} - {new Date(event.end_time).toLocaleTimeString()}
              </p>
              {event.description && <p className="event-desc">{event.description}</p>}
            </div>
          </div>
        )) : (
          <div className="empty-state">
            <FiCalendar size={48} />
            <p>No events scheduled yet.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
            <h2>Schedule New Event</h2>
            <form onSubmit={handleCreateEvent} className="event-form">
              <div className="form-group">
                <label>Event Title</label>
                <input type="text" className="input-field" required value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Start Time</label>
                <input type="datetime-local" className="input-field" required value={newEvent.start_time} onChange={e => setNewEvent({...newEvent, start_time: e.target.value})} />
              </div>
              <div className="form-group">
                <label>End Time</label>
                <input type="datetime-local" className="input-field" required value={newEvent.end_time} onChange={e => setNewEvent({...newEvent, end_time: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="input-field" value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})}></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
