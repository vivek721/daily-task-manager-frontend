import React from 'react';
import type { Task } from '../types/Task';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onDelete }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const getPriorityClass = (priority: string) => {
    return `priority-${priority}`;
  };

  const isOverdue = (dueDate?: Date) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && !task.completed;
  };

  const getTaskStatus = () => {
    if (task.completed) {
      return { text: 'Done', emoji: '✅', class: 'status-done' };
    }
    if (isOverdue(task.dueDate)) {
      return { text: 'Overdue', emoji: '⚠️', class: 'status-overdue' };
    }
    if (task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString()) {
      return { text: 'Due Today', emoji: '📅', class: 'status-due-today' };
    }
    return { text: 'In Progress', emoji: '🔄', class: 'status-in-progress' };
  };

  const status = getTaskStatus();

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''} ${isOverdue(task.dueDate) ? 'overdue' : ''}`}>
      <div className="task-content">
        <div className="task-header">
          <button
            className={`checkbox ${task.completed ? 'checked' : ''}`}
            onClick={() => onToggleComplete(task.id)}
          >
            {task.completed && <span className="checkmark">✓</span>}
          </button>
          
          <h3 className={`task-title ${task.completed ? 'completed' : ''}`}>
            {task.title}
          </h3>
          
          <div className="badges">
            <span className={`status-badge ${status.class}`}>
              {status.emoji} {status.text}
            </span>
            <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
              {task.priority}
            </span>
          </div>
        </div>
        
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
        
        <div className="task-meta">
          {task.dueDate && (
            <span className={`due-date ${isOverdue(task.dueDate) ? 'overdue' : ''}`}>
              Due: {formatDate(task.dueDate)}
            </span>
          )}
          
          {task.category && (
            <span className="category">{task.category}</span>
          )}
          
          <span className="created-date">
            Created: {formatDate(task.createdAt)}
          </span>
        </div>
      </div>
      
      <div className="task-actions">
        <button
          className="btn btn-danger"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};