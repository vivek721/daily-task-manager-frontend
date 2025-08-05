export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  category?: string;
  tags?: string[];
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  category: string;
}