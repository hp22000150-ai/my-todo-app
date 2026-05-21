"use client";

import { useState, useRef } from "react";
import { Todo, Category, Subtask } from "@/types/todo";
import { deleteTodo, updateTodo, addSubtask, toggleSubtask, deleteSubtask } from "@/app/actions";

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

const PRIORITY_STYLES = {
  high:   { border: "border-l-red-400",   dot: "bg-red-500",   label: "높음" },
  medium: { border: "border-l-amber-400", dot: "bg-amber-400", label: "보통" },
  low:    { border: "border-l-green-400", dot: "bg-green-500", label: "낮음" },
} as const;

function parseDueDate(dueDateStr: string) {
  const d = new Date(dueDateStr);
  const pad = (n: number) => String(n).padStart(2, "0");
  const dateOnly = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  return { dateOnly };
}

function MiniCalendar({ dueDate, dueTime }: { dueDate: Date; dueTime: string | null }) {
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

  return (
    <div className="w-52 rounded-xl border border-gray-200 bg-white p-3 shadow-xl dark:border-gray-700 dark:bg-gray-800">
      <p className="mb-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-200">
        {year}년 {month + 1}월
      </p>
      <div className="grid grid-cols-7 text-center text-xs">
        {DAYS.map((d) => (
          <div key={d} className="py-1 font-medium text-gray-400 dark:text-gray-500">{d}</div>
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
      {dueTime && (
        <p className="mt-2 border-t border-gray-100 pt-2 text-center text-xs font-medium text-blue-500 dark:border-gray-700">
          ⏰ {dueTime}
        </p>
      )}
    </div>
  );
}

function DdayBadge({ dueDateStr, dueTime }: { dueDateStr: string; dueTime: string | null }) {
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
        {label}{dueTime ? ` ${dueTime}` : ""}
      </span>
      {show && (
        <div className="absolute bottom-full right-0 z-20 mb-2">
          <MiniCalendar dueDate={new Date(dueDateStr)} dueTime={dueTime} />
        </div>
      )}
    </div>
  );
}

export default function TodoItem({
  todo,
  categories,
  subtasks,
  onToggle,
}: {
  todo: Todo;
  categories: Category[];
  subtasks: Subtask[];
  onToggle: (id: string, completed: boolean) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const subtaskInputRef = useRef<HTMLInputElement>(null);
  const [editTitle, setEditTitle] = useState(todo.title);

  const { dateOnly: initDate } = todo.due_date ? parseDueDate(todo.due_date) : { dateOnly: "" };
  const [editDate, setEditDate] = useState(initDate);
  const [editTime, setEditTime] = useState(todo.due_time ?? "");
  const [editPriority, setEditPriority] = useState<"high" | "medium" | "low">(todo.priority ?? "medium");
  const [editNote, setEditNote] = useState(todo.note ?? "");

  function cancelEdit() {
    setEditTitle(todo.title);
    setEditDate(initDate);
    setEditTime(todo.due_time ?? "");
    setEditPriority(todo.priority ?? "medium");
    setEditNote(todo.note ?? "");
    setEditing(false);
  }

  async function handleEdit() {
    if (!editTitle.trim()) return;
    const dateChanged = editDate !== initDate || editTime !== (todo.due_time ?? "");
    await updateTodo(
      todo.id,
      editTitle,
      dateChanged ? editDate || null : undefined,
      dateChanged ? editTime || null : undefined,
      editPriority !== (todo.priority ?? "medium") ? editPriority : undefined,
      editNote !== (todo.note ?? "") ? editNote : undefined,
    );
    setEditing(false);
  }

  const category = categories.find((c) => c.id === todo.category_id);
  const pStyle = PRIORITY_STYLES[todo.priority ?? "medium"];

  const recurringLabel = todo.is_recurring
    ? todo.recurrence_days === 1 ? "매일"
    : todo.recurrence_days === 7 ? "매주"
    : todo.recurrence_days === 14 ? "격주"
    : todo.recurrence_days === 30 ? "매월"
    : `${todo.recurrence_days}일마다`
    : null;

  return (
    <li className={`flex items-start gap-3 rounded-lg border border-gray-100 border-l-4 ${pStyle.border} bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800`}>
      <button
        onClick={() => onToggle(todo.id, todo.completed)}
        className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
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

      <div className="flex flex-1 flex-col gap-1 min-w-0">
        {editing ? (
          <>
            <input
              autoFocus
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Escape") cancelEdit(); }}
              className="w-full rounded border border-blue-400 px-2 py-0.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 dark:bg-gray-700 dark:text-white"
            />
            <div className="flex flex-wrap items-center gap-1.5">
              <input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="rounded border border-gray-200 px-2 py-0.5 text-xs text-gray-600 outline-none focus:border-blue-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
              />
              <input
                type="time"
                value={editTime}
                onChange={(e) => setEditTime(e.target.value)}
                className="w-28 rounded border border-gray-200 px-2 py-0.5 text-xs text-gray-600 outline-none focus:border-blue-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
              />
              <div className="flex gap-1">
                {(["high", "medium", "low"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setEditPriority(p)}
                    className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs transition-all ${
                      editPriority === p
                        ? "bg-gray-100 text-gray-700 ring-1 ring-gray-300 dark:bg-gray-600 dark:text-gray-200"
                        : "text-gray-400 hover:text-gray-600 dark:text-gray-500"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${PRIORITY_STYLES[p].dot}`} />
                    {PRIORITY_STYLES[p].label}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
              placeholder="메모 추가..."
              rows={2}
              className="w-full resize-none rounded border border-gray-200 px-2 py-1 text-xs text-gray-600 outline-none focus:border-blue-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:placeholder-gray-500"
            />
            <div className="flex gap-1.5">
              <button
                onClick={handleEdit}
                className="rounded bg-blue-500 px-2 py-0.5 text-xs font-medium text-white hover:bg-blue-600"
              >
                저장
              </button>
              <button
                onClick={cancelEdit}
                className="rounded px-2 py-0.5 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                취소
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <span
                className={`flex-1 truncate text-sm ${
                  todo.completed
                    ? "text-gray-400 line-through dark:text-gray-500"
                    : "text-gray-700 dark:text-gray-200"
                }`}
              >
                {todo.title}
              </span>
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
                <DdayBadge dueDateStr={todo.due_date} dueTime={todo.due_time} />
              )}
            </div>
            {todo.note && (
              <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                {todo.note}
              </p>
            )}

            {/* 서브태스크 토글 버튼 */}
            <button
              onClick={() => setShowSubtasks((v) => !v)}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-500 dark:text-gray-600 dark:hover:text-blue-400 transition-colors"
            >
              <svg className={`h-3 w-3 transition-transform ${showSubtasks ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              세부 항목
              {subtasks.length > 0 && (
                <span className="ml-1 font-medium text-blue-400">
                  {subtasks.filter(s => s.completed).length}/{subtasks.length}
                </span>
              )}
            </button>

            {showSubtasks && (
              <div className="mt-1 space-y-1 pl-1">
                {subtasks.map((s) => (
                  <div key={s.id} className="flex items-center gap-2 group">
                    <button
                      onClick={() => toggleSubtask(s.id, s.completed)}
                      className={`h-4 w-4 flex-shrink-0 rounded border transition-colors ${
                        s.completed
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300 hover:border-blue-400 dark:border-gray-600"
                      } flex items-center justify-center`}
                    >
                      {s.completed && (
                        <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <span className={`flex-1 text-xs ${s.completed ? "line-through text-gray-400" : "text-gray-600 dark:text-gray-300"}`}>
                      {s.title}
                    </span>
                    <button
                      onClick={() => deleteSubtask(s.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all"
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const input = subtaskInputRef.current;
                    if (!input?.value.trim()) return;
                    await addSubtask(todo.id, input.value);
                    input.value = "";
                  }}
                  className="flex items-center gap-1.5 pt-0.5"
                >
                  <input
                    ref={subtaskInputRef}
                    type="text"
                    placeholder="세부 항목 추가..."
                    className="flex-1 rounded border border-gray-200 px-2 py-0.5 text-xs outline-none focus:border-blue-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:placeholder-gray-500"
                  />
                  <button type="submit" className="text-xs text-blue-500 hover:text-blue-600 font-medium">
                    추가
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>

      {!editing && (
        <button
          onClick={() => setEditing(true)}
          className="mt-0.5 flex-shrink-0 text-gray-300 transition-colors hover:text-blue-400 dark:text-gray-600 dark:hover:text-blue-400"
          aria-label="편집"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      )}

      <button
        onClick={() => deleteTodo(todo.id)}
        className="mt-0.5 flex-shrink-0 text-gray-300 transition-colors hover:text-red-400 dark:text-gray-600 dark:hover:text-red-400"
        aria-label="삭제"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </li>
  );
}
