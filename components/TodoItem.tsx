"use client";

import { Todo } from "@/types/todo";
import { toggleTodo, deleteTodo } from "@/app/actions";

export default function TodoItem({ todo }: { todo: Todo }) {
  return (
    <li className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <button
        onClick={() => toggleTodo(todo.id, todo.completed)}
        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          todo.completed
            ? "border-blue-500 bg-blue-500"
            : "border-gray-300 hover:border-blue-400 dark:border-gray-600"
        }`}
        aria-label={todo.completed ? "완료 취소" : "완료 표시"}
      >
        {todo.completed && (
          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <span
        className={`flex-1 text-sm ${
          todo.completed
            ? "text-gray-400 line-through dark:text-gray-500"
            : "text-gray-700 dark:text-gray-200"
        }`}
      >
        {todo.title}
      </span>

      <button
        onClick={() => deleteTodo(todo.id)}
        className="text-gray-300 transition-colors hover:text-red-400 dark:text-gray-600 dark:hover:text-red-400"
        aria-label="삭제"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </li>
  );
}
