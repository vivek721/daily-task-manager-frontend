import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './store';
import type { Task } from '../types/Task';

// Basic selectors
export const selectTasks = (state: RootState) => state.tasks.tasks;
export const selectTasksLoading = (state: RootState) => state.tasks.loading;
export const selectTasksError = (state: RootState) => state.tasks.error;

// Memoized selectors
export const selectTaskById = createSelector(
  [selectTasks, (_: RootState, taskId: string) => taskId],
  (tasks, taskId) => tasks.find(task => task.id === taskId)
);

export const selectCompletedTasks = createSelector(
  [selectTasks],
  (tasks) => tasks.filter(task => task.completed)
);

export const selectPendingTasks = createSelector(
  [selectTasks],
  (tasks) => tasks.filter(task => !task.completed)
);

export const selectTasksByPriority = createSelector(
  [selectTasks],
  (tasks) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return [...tasks].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }
);

// Old tasks selectors (moved up to avoid circular dependency)
export const selectOldTasks = createSelector(
  [selectTasks],
  (tasks) => {
    const today = new Date();
    const todayString = today.toDateString();
    
    const isOld = (date: Date | string) => {
      const taskDate = new Date(date);
      const taskDateString = taskDate.toDateString();
      return taskDateString !== todayString && taskDate < today;
    };

    return tasks.filter(task => {
      // Task is old if:
      // 1. It has a due date that's in the past (before today)
      // 2. It was created before today and has no due date
      if (task.dueDate) {
        return isOld(task.dueDate);
      } else {
        return isOld(task.createdAt);
      }
    });
  }
);

export const selectTodaysTasks = createSelector(
  [selectTasks],
  (tasks) => {
    const today = new Date();
    const todayString = today.toDateString();
    
    return tasks.filter(task => {
      // For debugging, let's be more inclusive initially
      // Task is for today if:
      // 1. It was created today (regardless of due date)
      // 2. It has a due date that is today or in the future
      
      const createdToday = new Date(task.createdAt).toDateString() === todayString;
      const hasFutureDueDate = task.dueDate && new Date(task.dueDate) >= today;
      const hasTodayDueDate = task.dueDate && new Date(task.dueDate).toDateString() === todayString;
      
      return createdToday || hasFutureDueDate || hasTodayDueDate;
    });
  }
);

export const selectOtherTasks = createSelector(
  [selectTasks, selectTodaysTasks, selectOldTasks],
  (allTasks, todaysTasks, oldTasks) => {
    const todaysTaskIds = new Set(todaysTasks.map(task => task.id));
    const oldTaskIds = new Set(oldTasks.map(task => task.id));
    
    return allTasks.filter(task => 
      !todaysTaskIds.has(task.id) && !oldTaskIds.has(task.id)
    );
  }
);

export const selectOverdueTasks = createSelector(
  [selectPendingTasks],
  (pendingTasks) => {
    const now = new Date();
    return pendingTasks.filter(task => {
      if (!task.dueDate) return false;
      return new Date(task.dueDate) < now;
    });
  }
);

export const selectTaskStats = createSelector(
  [selectTasks, selectCompletedTasks, selectPendingTasks, selectOverdueTasks],
  (allTasks, completedTasks, pendingTasks, overdueTasks) => ({
    total: allTasks.length,
    completed: completedTasks.length,
    pending: pendingTasks.length,
    overdue: overdueTasks.length,
    completionRate: allTasks.length > 0 ? (completedTasks.length / allTasks.length) * 100 : 0,
  })
);

export const selectTasksByCategory = createSelector(
  [selectTasks],
  (tasks) => {
    const categories = new Map<string, Task[]>();
    
    tasks.forEach(task => {
      const category = task.category || 'Uncategorized';
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category)!.push(task);
    });
    
    return Object.fromEntries(categories);
  }
);


export const selectOldIncompleteTasks = createSelector(
  [selectOldTasks],
  (oldTasks) => oldTasks.filter(task => !task.completed)
);

export const selectOldCompletedTasks = createSelector(
  [selectOldTasks],
  (oldTasks) => oldTasks.filter(task => task.completed)
);

export const selectTasksByDate = createSelector(
  [selectTasks],
  (tasks) => {
    const tasksByDate = new Map<string, Task[]>();
    
    tasks.forEach(task => {
      const dateKey = task.dueDate 
        ? new Date(task.dueDate).toDateString()
        : new Date(task.createdAt).toDateString();
      
      if (!tasksByDate.has(dateKey)) {
        tasksByDate.set(dateKey, []);
      }
      tasksByDate.get(dateKey)!.push(task);
    });
    
    // Sort by date (most recent first)
    const sortedEntries = Array.from(tasksByDate.entries()).sort((a, b) => {
      return new Date(b[0]).getTime() - new Date(a[0]).getTime();
    });
    
    return Object.fromEntries(sortedEntries);
  }
);