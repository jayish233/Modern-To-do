export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string; // url or emoji/identifier
  createdAt: string;
}

export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Todo {
  id: string;
  userId: string;
  text: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate: string | null;
  subtasks: SubTask[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  color: string; // CSS class color representation
}
