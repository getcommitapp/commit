export interface Task {
  name: string;
  slug: string;
  description?: string | null;
  completed: boolean;
  due_date: string;
}

export interface TasksResponse {
  tasks: Task[];
}
