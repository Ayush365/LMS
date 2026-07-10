import React, { useState, useEffect, useContext } from 'react';
import './FocusMode.css';
import { FiX, FiPlay, FiPause, FiCheckCircle } from 'react-icons/fi';
import api from '../api';

const FocusMode = ({ task, onClose, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isActive, setIsActive] = useState(false);
  const [sessionLogged, setSessionLogged] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && !sessionLogged) {
      setIsActive(false);
      logSession();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const logSession = async () => {
    try {
      // 25 mins or actual time spent
      const duration = 25 - Math.ceil(timeLeft / 60);
      if (duration > 0) {
        await api.post('/study-sessions/', {
          task_id: task.id,
          duration_minutes: duration
        });
        setSessionLogged(true);
      }
    } catch (err) {
      console.error('Failed to log session', err);
    }
  };

  const handleClose = async () => {
    if (isActive) {
      setIsActive(false);
      await logSession();
    }
    onClose();
  };

  const handleCompleteTask = async () => {
    try {
      await api.put(`/tasks/${task.id}/complete`);
      await logSession();
      onComplete();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="focus-overlay">
      <div className="focus-container">
        <button className="close-focus" onClick={handleClose}>
          <FiX size={32} />
        </button>
        
        <div className="focus-header">
          <h2>Focus Mode</h2>
          <p className="focus-task-title">{task.title}</p>
        </div>

        <div className="timer-display">
          {formatTime(timeLeft)}
        </div>

        <div className="focus-controls">
          <button className="btn btn-primary" onClick={toggleTimer} style={{ borderRadius: '50%', width: '80px', height: '80px', fontSize: '2rem' }}>
            {isActive ? <FiPause /> : <FiPlay />}
          </button>
        </div>

        <div className="focus-actions">
          <button className="btn btn-secondary" onClick={handleCompleteTask}>
            <FiCheckCircle /> Mark Task Complete
          </button>
        </div>
      </div>
    </div>
  );
};

export default FocusMode;
