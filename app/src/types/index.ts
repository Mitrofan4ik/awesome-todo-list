export interface Task {
  id: string;
  title: string;
  completed: boolean;
  columnId: string;
  order: number;
  createdAt: number;
}

export interface Column {
  id: string;
  title: string;
  order: number;
}

export interface TodoState {
  tasks: Task[];
  columns: Column[];
}
