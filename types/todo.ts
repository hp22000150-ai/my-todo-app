export interface Todo {
  id: string;
  user_id: string;
  title: string;
  completed: boolean;
  due_date: string | null;
  sort_order: number | null;
  created_at: string;
}
