"use client";

import { useRef } from "react";
import { addTodo } from "@/app/actions";
import { Category } from "@/types/todo";

export default function AddTodo({ categories }: { categories: Category[] }) {
  const ref = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    await addTodo(formData);
    ref.current?.reset();
  }

  return (
    <form ref={ref} action={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <input
          name="title"
          type="text"
          placeholder="새 할 일을 입력하세요..."
          required
          className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500"
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 active:bg-blue-700"
        >
          추가
        </button>
      </div>
      <div className="flex gap-2">
        <input
          name="due_date"
          type="date"
          className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-500 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
        />
        {categories.length > 0 && (
          <select
            name="category_id"
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
          >
            <option value="">카테고리 없음</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        )}
      </div>
    </form>
  );
}
