import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  selectOldTasks, 
  selectOldIncompleteTasks, 
  selectOldCompletedTasks,
  selectTasksByDate 
} from '../store/selectors';
import { 
  toggleTaskComplete, 
  deleteTask, 
  completeAllOldTasks, 
  deleteAllOldTasks,
  deleteAllCompletedOldTasks 
} from '../store/taskSlice';
import { TaskItem } from './TaskItem';

export const OldTasks: React.FC = () => {
  const dispatch = useAppDispatch();
  const oldTasks = useAppSelector(selectOldTasks);
  const oldIncompleteTasks = useAppSelector(selectOldIncompleteTasks);
  const oldCompletedTasks = useAppSelector(selectOldCompletedTasks);
  const tasksByDate = useAppSelector(selectTasksByDate);
  
  const [viewMode, setViewMode] = useState<'grouped' | 'incomplete' | 'completed'>('incomplete');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleComplete = (id: string) => {
    dispatch(toggleTaskComplete(id));
  };

  const handleDeleteTask = (id: string) => {
    dispatch(deleteTask(id));
  };

  const handleCompleteAllOld = () => {
    if (window.confirm('Mark all old incomplete tasks as completed?')) {
      dispatch(completeAllOldTasks());
    }
  };

  const handleDeleteAllOld = () => {
    if (window.confirm('Delete all old tasks? This action cannot be undone.')) {
      dispatch(deleteAllOldTasks());
    }
  };

  const handleDeleteAllCompleted = () => {
    if (window.confirm('Delete all completed old tasks? This action cannot be undone.')) {
      dispatch(deleteAllCompletedOldTasks());
    }
  };

  const formatDateGroup = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) {
      return `${diffDays} days ago`;
    }
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getOldTasksByDate = () => {
    const today = new Date().toDateString();
    const oldTasksByDate: { [key: string]: any[] } = {};
    
    Object.entries(tasksByDate).forEach(([dateString, tasks]) => {
      if (dateString !== today && new Date(dateString) < new Date(today)) {
        oldTasksByDate[dateString] = tasks;
      }
    });
    
    return oldTasksByDate;
  };

  if (oldTasks.length === 0) {
    return null;
  }

  return (
    <div className="old-tasks-section">
      <div className="old-tasks-header">
        <div className="old-tasks-title" onClick={() => setIsExpanded(!isExpanded)}>
          <h3>Old Tasks ({oldTasks.length})</h3>
          <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
        </div>
      </div>

      {isExpanded && (
        <div className="old-tasks-content">
          <div className="old-tasks-controls">
            <div className="view-mode-tabs">
              <button 
                className={`tab-btn ${viewMode === 'incomplete' ? 'active' : ''}`}
                onClick={() => setViewMode('incomplete')}
              >
                Incomplete ({oldIncompleteTasks.length})
              </button>
              <button 
                className={`tab-btn ${viewMode === 'completed' ? 'active' : ''}`}
                onClick={() => setViewMode('completed')}
              >
                Completed ({oldCompletedTasks.length})
              </button>
              <button 
                className={`tab-btn ${viewMode === 'grouped' ? 'active' : ''}`}
                onClick={() => setViewMode('grouped')}
              >
                By Date
              </button>
            </div>

            <div className="bulk-actions">
              {oldIncompleteTasks.length > 0 && (
                <button 
                  className="btn btn-secondary bulk-btn"
                  onClick={handleCompleteAllOld}
                  title="Mark all old incomplete tasks as completed"
                >
                  Complete All
                </button>
              )}
              
              {oldCompletedTasks.length > 0 && (
                <button 
                  className="btn btn-secondary bulk-btn"
                  onClick={handleDeleteAllCompleted}
                  title="Delete all completed old tasks"
                >
                  Delete Completed
                </button>
              )}
              
              <button 
                className="btn btn-danger bulk-btn"
                onClick={handleDeleteAllOld}
                title="Delete all old tasks"
              >
                Delete All
              </button>
            </div>
          </div>

          <div className="old-tasks-list">
            {viewMode === 'incomplete' && (
              <div className="task-group">
                {oldIncompleteTasks.length === 0 ? (
                  <p className="empty-message">No incomplete old tasks</p>
                ) : (
                  oldIncompleteTasks.map(task => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggleComplete={handleToggleComplete}
                      onDelete={handleDeleteTask}
                    />
                  ))
                )}
              </div>
            )}

            {viewMode === 'completed' && (
              <div className="task-group">
                {oldCompletedTasks.length === 0 ? (
                  <p className="empty-message">No completed old tasks</p>
                ) : (
                  oldCompletedTasks.map(task => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggleComplete={handleToggleComplete}
                      onDelete={handleDeleteTask}
                    />
                  ))
                )}
              </div>
            )}

            {viewMode === 'grouped' && (
              <div className="tasks-by-date">
                {Object.entries(getOldTasksByDate()).map(([dateString, tasks]) => (
                  <div key={dateString} className="date-group">
                    <h4 className="date-group-title">{formatDateGroup(dateString)}</h4>
                    <div className="date-group-tasks">
                      {tasks.map(task => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          onToggleComplete={handleToggleComplete}
                          onDelete={handleDeleteTask}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};