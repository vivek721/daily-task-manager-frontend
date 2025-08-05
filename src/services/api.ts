const API_BASE_URL = 'http://localhost:3001/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
}

export interface ApiTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  category?: string;
  tags?: string[];
  deleted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  due_date?: string;
  category?: string;
  tags?: string[];
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  due_date?: string;
  category?: string;
  tags?: string[];
}

export interface SignUpData {
  username: string;
  email: string;
  name: string;
  password: string;
}

export interface SignInData {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    username?: string;
  };
  message: string;
}

class TaskAPI {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      
      // Handle authentication errors
      if (response.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
        throw new Error('Authentication required');
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get all tasks
  async getAllTasks(): Promise<ApiResponse<ApiTask[]>> {
    return this.request<ApiTask[]>('/tasks');
  }

  // Get today's tasks
  async getTodaysTasks(): Promise<ApiResponse<ApiTask[]>> {
    return this.request<ApiTask[]>('/tasks/today');
  }

  // Get old tasks
  async getOldTasks(): Promise<ApiResponse<ApiTask[]>> {
    return this.request<ApiTask[]>('/tasks/old');
  }

  // Get task by ID
  async getTaskById(id: string): Promise<ApiResponse<ApiTask>> {
    return this.request<ApiTask>(`/tasks/${id}`);
  }

  // Create task
  async createTask(taskData: CreateTaskData): Promise<ApiResponse<ApiTask>> {
    return this.request<ApiTask>('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  // Update task
  async updateTask(id: string, taskData: UpdateTaskData): Promise<ApiResponse<ApiTask>> {
    return this.request<ApiTask>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  // Delete task (soft delete)
  async deleteTask(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // Toggle task completion
  async toggleTaskComplete(id: string): Promise<ApiResponse<ApiTask>> {
    return this.request<ApiTask>(`/tasks/${id}/toggle`, {
      method: 'PATCH',
    });
  }

  // Restore deleted task
  async restoreTask(id: string): Promise<ApiResponse<ApiTask>> {
    return this.request<ApiTask>(`/tasks/${id}/restore`, {
      method: 'PATCH',
    });
  }

  // Permanently delete task
  async permanentlyDeleteTask(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/tasks/${id}/permanent`, {
      method: 'DELETE',
    });
  }

  // Get deleted tasks
  async getDeletedTasks(): Promise<ApiResponse<ApiTask[]>> {
    return this.request<ApiTask[]>('/tasks/deleted');
  }

  // Get task history
  async getTaskHistory(taskId?: string, limit: number = 100): Promise<ApiResponse<any[]>> {
    const endpoint = taskId 
      ? `/tasks/${taskId}/history?limit=${limit}`
      : `/tasks/history/all?limit=${limit}`;
    return this.request<any[]>(endpoint);
  }

  // Bulk operations
  async markAllOldTasksComplete(): Promise<ApiResponse<{ count: number }>> {
    return this.request<{ count: number }>('/tasks/old/complete-all', {
      method: 'PATCH',
    });
  }

  async deleteAllOldTasks(): Promise<ApiResponse<{ count: number }>> {
    return this.request<{ count: number }>('/tasks/old/all', {
      method: 'DELETE',
    });
  }

  async deleteCompletedOldTasks(): Promise<ApiResponse<{ count: number }>> {
    return this.request<{ count: number }>('/tasks/old/completed', {
      method: 'DELETE',
    });
  }

  // Cleanup expired tasks
  async cleanupExpiredTasks(): Promise<ApiResponse<{ deletedCount: number }>> {
    return this.request<{ deletedCount: number }>('/tasks/cleanup', {
      method: 'POST',
    });
  }

  // Authentication methods
  async signUp(userData: SignUpData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }
      
      return data;
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  }

  async signIn(credentials: SignInData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Sign in failed');
      }
      
      return data;
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    }
  }

  async verifyToken(): Promise<{ success: boolean; user: any }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Token verification failed');
      }
      
      return data;
    } catch (error) {
      console.error('Token verification failed:', error);
      throw error;
    }
  }
}

export const taskAPI = new TaskAPI();