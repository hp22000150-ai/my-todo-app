"use client";

import { useState } from "react";
import AddTodo from "./AddTodo";
import { Category } from "@/types/todo";

export default function AddTodoModal({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="flex w-full items-center gap-2 px-4 py-3 text-sm text-gray-400 transition-colors hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          새 일정 추가
        </button>
      ) : (
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">새 일정 추가</span>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-300 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-400"
              aria-label="닫기"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <AddTodo categories={categories} onSuccess={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
