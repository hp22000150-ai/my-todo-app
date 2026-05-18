export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface Todo {
  id: string;
  user_id: string;
  title: string;
  completed: boolean;
  due_date: string | null;
  sort_order: number | null;
  category_id: string | null;
  due_time: string | null;
  priority: 'high' | 'medium' | 'low' | null;
  note: string | null;
  is_recurring: boolean;
  recurrence_days: number | null;
  created_at: string;
}
