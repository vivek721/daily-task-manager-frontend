import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Task, TaskFormData } from '../types/Task';
import { taskAPI, type ApiTask } from '../services/api';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

// Helper function to convert API task to frontend task
const convertApiTaskToTask = (apiTask: ApiTask): Task => ({
  id: apiTask.id,
  title: apiTask.title,
  description: apiTask.description,
  completed: apiTask.completed,
  priority: apiTask.priority,
  dueDate: apiTask.due_date ? new Date(apiTask.due_date) : undefined,
  createdAt: new Date(apiTask.created_at),
  updatedAt: new Date(apiTask.updated_at),
  category: apiTask.category,
});

// Helper function to convert frontend task form to API format
const convertTaskFormToApiFormat = (taskData: TaskFormData) => ({
  title: taskData.title,
  description: taskData.description || undefined,
  priority: taskData.priority,
  due_date: taskData.dueDate || undefined,
  category: taskData.category || undefined,
});

// Async thunks
export const fetchAllTasks = createAsyncThunk(
  'tasks/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await taskAPI.getAllTasks();
      if (response.success && response.data) {
        return response.data.map(convertApiTaskToTask);
      }
      return rejectWithValue(response.message || 'Failed to fetch tasks');
    } catch (error) {
      return rejectWithValue('Network error while fetching tasks');
    }
  }
);

export const addTask = createAsyncThunk(
  'tasks/add',
  async (taskData: TaskFormData, { rejectWithValue }) => {
    try {
      const apiTaskData = convertTaskFormToApiFormat(taskData);
      const response = await taskAPI.createTask(apiTaskData);
      if (response.success && response.data) {
        return convertApiTaskToTask(response.data);
      }
      return rejectWithValue(response.message || 'Failed to create task');
    } catch (error) {
      return rejectWithValue('Network error while creating task');
    }
  }
);

export const toggleTaskComplete = createAsyncThunk(
  'tasks/toggleComplete',
  async (taskId: string, { rejectWithValue }) => {
    try {
      const response = await taskAPI.toggleTaskComplete(taskId);
      if (response.success && response.data) {
        return convertApiTaskToTask(response.data);
      }
      return rejectWithValue(response.message || 'Failed to toggle task');
    } catch (error) {
      return rejectWithValue('Network error while toggling task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (taskId: string, { rejectWithValue }) => {
    try {
      const response = await taskAPI.deleteTask(taskId);
      if (response.success) {
        return taskId;
      }
      return rejectWithValue(response.message || 'Failed to delete task');
    } catch (error) {
      return rejectWithValue('Network error while deleting task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ id, ...taskData }: Partial<Task> & { id: string }, { rejectWithValue }) => {
    try {
      const apiUpdateData = {
        title: taskData.title,
        description: taskData.description,
        completed: taskData.completed,
        priority: taskData.priority,
        due_date: taskData.dueDate?.toISOString(),
        category: taskData.category,
      };
      
      const response = await taskAPI.updateTask(id, apiUpdateData);
      if (response.success && response.data) {
        return convertApiTaskToTask(response.data);
      }
      return rejectWithValue(response.message || 'Failed to update task');
    } catch (error) {
      return rejectWithValue('Network error while updating task');
    }
  }
);

// Bulk operations
export const completeAllOldTasks = createAsyncThunk(
  'tasks/completeAllOld',
  async (_, { rejectWithValue }) => {
    try {
      const response = await taskAPI.markAllOldTasksComplete();
      if (response.success) {
        // Refetch all tasks to get updated data
        const tasksResponse = await taskAPI.getAllTasks();
        if (tasksResponse.success && tasksResponse.data) {
          return tasksResponse.data.map(convertApiTaskToTask);
        }
      }
      return rejectWithValue(response.message || 'Failed to complete old tasks');
    } catch (error) {
      return rejectWithValue('Network error while completing old tasks');
    }
  }
);

export const deleteAllOldTasks = createAsyncThunk(
  'tasks/deleteAllOld',
  async (_, { rejectWithValue }) => {
    try {
      const response = await taskAPI.deleteAllOldTasks();
      if (response.success) {
        // Refetch all tasks to get updated data
        const tasksResponse = await taskAPI.getAllTasks();
        if (tasksResponse.success && tasksResponse.data) {
          return tasksResponse.data.map(convertApiTaskToTask);
        }
      }
      return rejectWithValue(response.message || 'Failed to delete old tasks');
    } catch (error) {
      return rejectWithValue('Network error while deleting old tasks');
    }
  }
);

export const deleteAllCompletedOldTasks = createAsyncThunk(
  'tasks/deleteAllCompletedOld',
  async (_, { rejectWithValue }) => {
    try {
      const response = await taskAPI.deleteCompletedOldTasks();
      if (response.success) {
        // Refetch all tasks to get updated data
        const tasksResponse = await taskAPI.getAllTasks();
        if (tasksResponse.success && tasksResponse.data) {
          return tasksResponse.data.map(convertApiTaskToTask);
        }
      }
      return rejectWithValue(response.message || 'Failed to delete completed old tasks');
    } catch (error) {
      return rejectWithValue('Network error while deleting completed old tasks');
    }
  }
);

// Restore a deleted task
export const restoreTask = createAsyncThunk(
  'tasks/restore',
  async (taskId: string, { rejectWithValue }) => {
    try {
      const response = await taskAPI.restoreTask(taskId);
      if (response.success && response.data) {
        return convertApiTaskToTask(response.data);
      }
      return rejectWithValue(response.message || 'Failed to restore task');
    } catch (error) {
      return rejectWithValue('Network error while restoring task');
    }
  }
);

// Permanently delete a task
export const permanentlyDeleteTask = createAsyncThunk(
  'tasks/permanentDelete',
  async (taskId: string, { rejectWithValue }) => {
    try {
      const response = await taskAPI.permanentlyDeleteTask(taskId);
      if (response.success) {
        return taskId;
      }
      return rejectWithValue(response.message || 'Failed to permanently delete task');
    } catch (error) {
      return rejectWithValue('Network error while permanently deleting task');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearTasks: (state) => {
      state.tasks = [];
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch all tasks
    builder
      .addCase(fetchAllTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
        state.error = null;
      })
      .addCase(fetchAllTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Add task
    builder
      .addCase(addTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
        state.error = null;
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Toggle task complete
    builder
      .addCase(toggleTaskComplete.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(toggleTaskComplete.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Delete task
    builder
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Update task
    builder
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Bulk operations - all refetch tasks
    builder
      .addCase(completeAllOldTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      .addCase(deleteAllOldTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      .addCase(deleteAllCompletedOldTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
      });

    // Restore task
    builder
      .addCase(restoreTask.fulfilled, (state, action) => {
        // Add the restored task back to the tasks list
        state.tasks.push(action.payload);
      })
      .addCase(restoreTask.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Permanently delete task - no need to update state since it was already removed from active tasks
    builder
      .addCase(permanentlyDeleteTask.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  clearTasks,
  setError,
} = taskSlice.actions;

export default taskSlice.reducer;