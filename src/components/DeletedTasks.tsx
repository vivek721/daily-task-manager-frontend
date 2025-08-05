import { useState, useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { restoreTask, permanentlyDeleteTask } from '../store/taskSlice';
import './DeletedTasks.css';

interface DeletedTask {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  deleted_at: string;
  created_at: string;
}

export function DeletedTasks() {
  const dispatch = useAppDispatch();
  const [deletedTasks, setDeletedTasks] = useState<DeletedTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeletedTasks();
  }, []);

  const fetchDeletedTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/tasks/deleted');
      const data = await response.json();
      
      if (data.success) {
        setDeletedTasks(data.data);
      } else {
        console.error('Failed to fetch deleted tasks:', data.message);
        setDeletedTasks([]);
      }
    } catch (error) {
      console.error('Error fetching deleted tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreTask = async (taskId: string) => {
    try {
      await dispatch(restoreTask(taskId)).unwrap();
      // Remove from deleted tasks list
      setDeletedTasks(prev => prev.filter(task => task.id !== taskId));
      alert('Task restored successfully!');
    } catch (error) {
      console.error('Error restoring task:', error);
      alert('Error restoring task: ' + error);
    }
  };

  const handlePermanentlyDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to permanently delete this task? This action cannot be undone.')) {
      return;
    }

    try {
      await dispatch(permanentlyDeleteTask(taskId)).unwrap();
      // Remove from deleted tasks list
      setDeletedTasks(prev => prev.filter(task => task.id !== taskId));
      alert('Task permanently deleted!');
    } catch (error) {
      console.error('Error permanently deleting task:', error);
      alert('Error permanently deleting task: ' + error);
    }
  };

  const formatTimeRemaining = (deletedAt: string) => {
    const deleteTime = new Date(deletedAt);
    const expireTime = new Date(deleteTime.getTime() + 24 * 60 * 60 * 1000); // 24 hours
    const now = new Date();
    const remaining = expireTime.getTime() - now.getTime();

    if (remaining <= 0) {
      return 'Expired';
    }

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m remaining`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#757575';
    }
  };

  if (loading) {
    return (
      <div className="deleted-tasks">
        <div className="loading">Loading deleted tasks...</div>
      </div>
    );
  }

  return (
    <div className="deleted-tasks">
      <div className="deleted-header">
        <h2>🗑️ Deleted Tasks</h2>
        <p className="deleted-subtitle">
          Tasks are automatically deleted after 24 hours. You can restore them before they expire.
        </p>
      </div>

      {deletedTasks.length === 0 ? (
        <div className="no-deleted-tasks">
          <p>No deleted tasks found.</p>
          <p>Tasks you delete will appear here and can be restored within 24 hours.</p>
        </div>
      ) : (
        <div className="deleted-tasks-list">
          {deletedTasks.map((task) => (
            <div key={task.id} className="deleted-task-item">
              <div className="task-content">
                <div className="task-header">
                  <h3 className="task-title">{task.title}</h3>
                  <div 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(task.priority) }}
                  >
                    {task.priority}
                  </div>
                </div>
                
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
                
                {task.category && (
                  <div className="task-category">
                    📁 {task.category}
                  </div>
                )}
                
                <div className="task-meta">
                  <span className="deleted-time">
                    Deleted: {new Date(task.deleted_at).toLocaleString()}
                  </span>
                  <span className="time-remaining">
                    ⏰ {formatTimeRemaining(task.deleted_at)}
                  </span>
                </div>
              </div>
              
              <div className="task-actions">
                <button
                  onClick={() => handleRestoreTask(task.id)}
                  className="btn btn-restore"
                  title="Restore this task"
                >
                  🔄 Restore
                </button>
                <button
                  onClick={() => handlePermanentlyDelete(task.id)}
                  className="btn btn-danger"
                  title="Permanently delete this task"
                >
                  💥 Delete Forever
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}