"use client";

import { useRef, useState } from "react";
import { addTodo } from "@/app/actions";
import { Category } from "@/types/todo";

const PRIORITIES = [
  { value: "high", label: "높음", color: "bg-red-500" },
  { value: "medium", label: "보통", color: "bg-amber-400" },
  { value: "low", label: "낮음", color: "bg-green-500" },
] as const;

export default function AddTodo({
  categories,
  onSuccess,
}: {
  categories: Category[];
  onSuccess?: () => void;
}) {
  const ref = useRef<HTMLFormElement>(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");

  async function handleSubmit(formData: FormData) {
    formData.set("priority", priority);
    await addTodo(formData);
    ref.current?.reset();
    setIsRecurring(false);
    setPriority("medium");
    onSuccess?.();
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
        <input
          name="due_time"
          type="time"
          className="w-32 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
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

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1">
          {PRIORITIES.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPriority(p.value)}
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
                priority === p.value
                  ? "bg-gray-100 text-gray-700 ring-1 ring-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:ring-gray-500"
                  : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${p.color}`} />
              {p.label}
            </button>
          ))}
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <input
            type="checkbox"
            name="is_recurring"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="rounded"
          />
          반복 할 일
        </label>

        {isRecurring && (
          <select
            name="recurrence_days"
            className="rounded-lg border border-gray-200 px-3 py-1 text-sm text-gray-500 outline-none focus:border-blue-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
          >
            <option value="1">매일</option>
            <option value="7">매주</option>
            <option value="14">격주</option>
            <option value="30">매월</option>
          </select>
        )}
      </div>
    </form>
  );
}
