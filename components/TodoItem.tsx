"use client";

import { useState } from "react";
import { Todo, Category } from "@/types/todo";
import { deleteTodo, updateTodo } from "@/app/actions";

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

function MiniCalendar({ dueDate }: { dueDate: Date }) {
  const year = dueDate.getFullYear();
  const month = dueDate.getMonth();
  const dueDay = dueDate.getDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const monthLabel = `${year}년 ${month + 1}월`;

  return (
    <div className="w-52 rounded-xl border border-gray-200 bg-white p-3 shadow-xl dark:border-gray-700 dark:bg-gray-800">
      <p className="mb-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-200">
        {monthLabel}
      </p>
      <div className="grid grid-cols-7 text-center text-xs">
        {DAYS.map((d) => (
          <div key={d} className="py-1 font-medium text-gray-400 dark:text-gray-500">
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const thisDate = new Date(year, month, day);
          thisDate.setHours(0, 0, 0, 0);
          const isDue = day === dueDay;
          const isToday = thisDate.getTime() === today.getTime();
          return (
            <div
              key={i}
              className={`mx-auto my-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs transition-colors ${
                isDue
                  ? "bg-blue-500 font-bold text-white"
                  : isToday
                  ? "bg-gray-100 font-semibold text-gray-800 dark:bg-gray-700 dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DdayBadge({ dueDateStr }: { dueDateStr: string }) {
  const [show, setShow] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDateStr);
  due.setHours(0, 0, 0, 0);
  const diff = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const label = diff === 0 ? "D-day" : diff > 0 ? `D-${diff}` : `D+${Math.abs(diff)}`;
  const color =
    diff === 0
      ? "bg-red-500 text-white"
      : diff > 0
      ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300"
      : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400";

  return (
    <div
      className="relative flex-shrink-0"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className={`cursor-default rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>
        {label}
      </span>
      {show && (
        <div className="absolute bottom-full right-0 z-20 mb-2">
          <MiniCalendar dueDate={new Date(dueDateStr)} />
        </div>
      )}
    </div>
  );
}

export default function TodoItem({
  todo,
  categories,
  onToggle,
}: {
  todo: Todo;
  categories: Category[];
  onToggle: (id: string, completed: boolean) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);

  async function handleEdit() {
    if (editValue.trim() && editValue !== todo.title) {
      await updateTodo(todo.id, editValue);
    }
    setEditing(false);
  }

  const category = categories.find((c) => c.id === todo.category_id);

  const recurringLabel = todo.is_recurring
    ? todo.recurrence_days === 1
      ? "매일"
      : todo.recurrence_days === 7
      ? "매주"
      : todo.recurrence_days === 14
      ? "격주"
      : todo.recurrence_days === 30
      ? "매월"
      : `${todo.recurrence_days}일마다`
    : null;

  return (
    <li className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <button
        onClick={() => onToggle(todo.id, todo.completed)}
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

      <div className="flex flex-1 items-center gap-2 min-w-0">
        {editing ? (
          <input
            autoFocus
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEdit();
              if (e.key === "Escape") { setEditValue(todo.title); setEditing(false); }
            }}
            className="flex-1 rounded border border-blue-400 px-2 py-0.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 dark:bg-gray-700 dark:text-white"
          />
        ) : (
          <span
            className={`flex-1 truncate text-sm ${
              todo.completed
                ? "text-gray-400 line-through dark:text-gray-500"
                : "text-gray-700 dark:text-gray-200"
            }`}
          >
            {todo.title}
          </span>
        )}

        {category && (
          <span
            className="flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium text-white"
            style={{ backgroundColor: category.color }}
          >
            {category.name}
          </span>
        )}

        {recurringLabel && (
          <span className="flex-shrink-0 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-600 dark:bg-purple-900/40 dark:text-purple-300">
            🔁 {recurringLabel}
          </span>
        )}

        {todo.due_date && !todo.completed && (
          <DdayBadge dueDateStr={todo.due_date} />
        )}
      </div>

      {!editing && (
        <button
          onClick={() => setEditing(true)}
          className="text-gray-300 transition-colors hover:text-blue-400 dark:text-gray-600 dark:hover:text-blue-400"
          aria-label="편집"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      )}

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
