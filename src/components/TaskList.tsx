import React from 'react';
import type { Task } from '../types/Task';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  title?: string;
}

export const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onToggleComplete, 
  onDelete, 
  title = "Tasks" 
}) => {
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h2>{title}</h2>
        <div className="task-stats">
          <span className="completed-count">{completedCount}</span>
          <span className="separator">/</span>
          <span className="total-count">{totalCount}</span>
          <span className="stats-label">completed</span>
        </div>
      </div>
      
      {tasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks yet. Add your first task to get started!</p>
        </div>
      ) : (
        <div className="tasks">
          {sortedTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};