"use client";

import { useRef } from "react";
import { addTodo } from "@/app/actions";

export default function AddTodo() {
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
      <input
        name="due_date"
        type="date"
        className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-500 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
      />
    </form>
  );
}
