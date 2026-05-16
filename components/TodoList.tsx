import { Todo } from "@/types/todo";
import TodoItem from "./TodoItem";

export default function TodoList({ todos }: { todos: Todo[] }) {
  if (todos.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-gray-400 dark:text-gray-600">
        할 일이 없습니다. 새 항목을 추가해보세요!
      </div>
    );
  }

  const pending = todos.filter((t) => !t.completed);
  const done = todos.filter((t) => t.completed);

  return (
    <div className="space-y-4">
      {pending.length > 0 && (
        <section>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-600">
            할 일 ({pending.length})
          </p>
          <ul className="space-y-2">
            {pending.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        </section>
      )}

      {done.length > 0 && (
        <section>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-600">
            완료 ({done.length})
          </p>
          <ul className="space-y-2">
            {done.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
