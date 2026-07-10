import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { motion } from 'framer-motion';
import { FiClock, FiFlag, FiTag, FiPlus } from 'react-icons/fi';
import './Tasks.css';

const columns = [
  { id: 'To Do', title: 'To Do' },
  { id: 'In Progress', title: 'In Progress' },
  { id: 'Review', title: 'Review' },
  { id: 'Done', title: 'Done' }
];

const getPriorityColor = (priority) => {
  switch(priority) {
    case 'High': return 'var(--accent-danger)';
    case 'Medium': return 'var(--accent-warning)';
    case 'Low': return 'var(--accent-success)';
    default: return 'var(--text-secondary)';
  }
};

const Tasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    due_date: '',
    assigned_to: ''
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchTasks();
    if (user?.role === 'admin' || user?.role === 'teacher') {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/users');
      // Only show students in the assign list for better UX
      setUsers(res.data.filter(u => u.role === 'student' || u.id === user.id));
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get('/api/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    try {
      await api.patch(`/api/tasks/${taskId}`, { status: newStatus });
    } catch (err) {
      console.error(err);
      fetchTasks(); // Revert on failure
    }
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, status) => {
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      updateTaskStatus(parseInt(taskId), status);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newTask,
        due_date: newTask.due_date ? new Date(newTask.due_date).toISOString() : null
      };
      const res = await api.post('/api/tasks', payload);
      setTasks(prev => [...prev, res.data]);
      setShowModal(false);
      setNewTask({ title: '', description: '', priority: 'Medium', due_date: '', assigned_to: '' });
      fetchTasks(); // To get all fields populated properly
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading tasks...</div>;

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1>Task Board</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FiPlus /> New Task
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
            <h2>Create New Task</h2>
            <form onSubmit={handleCreateTask} className="task-form">
              <div className="form-group">
                <label>Title</label>
                <input type="text" className="input-field" required value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="input-field" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})}></textarea>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select className="input-field" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input type="date" className="input-field" value={newTask.due_date} onChange={e => setNewTask({...newTask, due_date: e.target.value})} />
              </div>
              {(user?.role === 'admin' || user?.role === 'teacher') && (
                <div className="form-group">
                  <label>Assign To</label>
                  <select 
                    className="input-field" 
                    value={newTask.assigned_to} 
                    onChange={e => setNewTask({...newTask, assigned_to: e.target.value})}
                  >
                    <option value="">Myself</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="kanban-board">
        {columns.map(col => (
          <div 
            key={col.id} 
            className="kanban-column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className="column-header">
              <h3>{col.title}</h3>
              <span className="task-count">
                {tasks.filter(t => t.status === col.id).length}
              </span>
            </div>
            
            <div className="column-content">
              {tasks.filter(t => t.status === col.id).map(task => (
                <motion.div 
                  key={task.id}
                  className="task-card"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  layoutId={`task-${task.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h4 className="task-title">{task.title}</h4>
                  <p className="task-desc">{task.description}</p>
                  
                  <div className="task-meta">
                    <div className="meta-item">
                      <FiClock /> {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}
                    </div>
                    <div className="meta-item" style={{ color: getPriorityColor(task.priority) }}>
                      <FiFlag /> {task.priority}
                    </div>
                  </div>
                  {task.assignee && task.assignee.id !== user.id && (
                    <div className="task-assignee">
                      <span>Assigned to: {task.assignee.name}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
