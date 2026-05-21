"use client";

import { useState } from "react";
import { Todo, Category } from "@/types/todo";

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];
const PRIORITY_COLORS: Record<string, string> = {
  high: "bg-red-400",
  medium: "bg-amber-400",
  low: "bg-green-400",
};

export default function CalendarView({
  todos,
  categories,
}: {
  todos: Todo[];
  categories: Category[];
}) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const pad = (n: number) => String(n).padStart(2, "0");

  const todosForDate = (dateStr: string) =>
    todos.filter((t) => {
      if (!t.due_date) return false;
      const d = new Date(t.due_date);
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` === dateStr;
    });

  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelectedDate(null);
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelectedDate(null);
  }

  const selectedTodos = selectedDate ? todosForDate(selectedDate) : [];

  return (
    <div className="space-y-4">
      {/* 월 네비게이션 */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-base font-semibold text-gray-800 dark:text-white">
          {year}년 {month + 1}월
        </span>
        <button
          onClick={nextMonth}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 달력 그리드 */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-700">
          {DAYS.map((d, i) => (
            <div
              key={d}
              className={`py-2 text-center text-xs font-medium ${
                i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {d}
            </div>
          ))}
        </div>

        {/* 날짜 셀 */}
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            if (!day) return <div key={i} className="h-16 border-b border-r border-gray-50 dark:border-gray-700/50 last:border-r-0" />;

            const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
            const dayTodos = todosForDate(dateStr);
            const isToday =
              today.getFullYear() === year &&
              today.getMonth() === month &&
              today.getDate() === day;
            const isSelected = selectedDate === dateStr;
            const dow = (firstDow + day - 1) % 7;

            const hovered = hoveredDate === dateStr;
            const colIndex = (firstDow + day - 1) % 7;
            const isRightEdge = colIndex >= 5;

            return (
              <div
                key={i}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                onMouseEnter={() => dayTodos.length > 0 && setHoveredDate(dateStr)}
                onMouseLeave={() => setHoveredDate(null)}
                className={`relative h-16 cursor-pointer border-b border-r border-gray-50 p-1 transition-colors last:border-r-0 dark:border-gray-700/50 ${
                  isSelected
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700/30"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                    isToday
                      ? "bg-blue-500 font-bold text-white"
                      : dow === 0
                      ? "text-red-400"
                      : dow === 6
                      ? "text-blue-400"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {day}
                </span>
                {/* 할 일 점 */}
                <div className="mt-0.5 flex flex-wrap gap-0.5">
                  {dayTodos.slice(0, 3).map((t) => (
                    <span
                      key={t.id}
                      className={`h-1.5 w-1.5 rounded-full ${
                        t.completed ? "bg-gray-300" : PRIORITY_COLORS[t.priority ?? "medium"]
                      }`}
                    />
                  ))}
                  {dayTodos.length > 3 && (
                    <span className="text-[10px] text-gray-400">+{dayTodos.length - 3}</span>
                  )}
                </div>

                {/* 호버 팝업 */}
                {hovered && (
                  <div
                    className={`pointer-events-none absolute bottom-full z-30 mb-2 w-52 rounded-xl border border-gray-200 bg-white p-3 shadow-xl dark:border-gray-600 dark:bg-gray-800 ${
                      isRightEdge ? "right-0" : "left-0"
                    }`}
                  >
                    <p className="mb-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
                      {month + 1}/{day} 일정 ({dayTodos.length})
                    </p>
                    <ul className="space-y-1.5">
                      {dayTodos.map((t) => {
                        const cat = categories.find((c) => c.id === t.category_id);
                        return (
                          <li key={t.id} className="flex items-start gap-1.5">
                            <span
                              className={`mt-0.5 h-2 w-2 flex-shrink-0 rounded-full ${
                                t.completed ? "bg-gray-300" : PRIORITY_COLORS[t.priority ?? "medium"]
                              }`}
                            />
                            <div className="min-w-0 flex-1">
                              <span className={`block truncate text-xs ${t.completed ? "line-through text-gray-400" : "text-gray-700 dark:text-gray-200"}`}>
                                {t.title}
                              </span>
                              <div className="flex items-center gap-1">
                                {t.due_time && (
                                  <span className="text-[10px] text-gray-400">⏰ {t.due_time}</span>
                                )}
                                {cat && (
                                  <span
                                    className="rounded-full px-1.5 py-px text-[10px] font-medium text-white"
                                    style={{ backgroundColor: cat.color }}
                                  >
                                    {cat.name}
                                  </span>
                                )}
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                    {/* 말풍선 꼬리 */}
                    <div className={`absolute top-full h-2 w-2 -translate-y-1 rotate-45 border-b border-r border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800 ${isRightEdge ? "right-4" : "left-4"}`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 선택한 날짜의 할 일 목록 */}
      {selectedDate && (
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
            {selectedDate.replace(/-/g, ".")} 일정
            <span className="ml-2 text-xs font-normal text-gray-400">({selectedTodos.length}개)</span>
          </p>
          {selectedTodos.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-600">일정이 없습니다.</p>
          ) : (
            <ul className="space-y-2">
              {selectedTodos.map((t) => {
                const cat = categories.find((c) => c.id === t.category_id);
                return (
                  <li key={t.id} className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 flex-shrink-0 rounded-full ${
                        t.completed ? "bg-gray-300" : PRIORITY_COLORS[t.priority ?? "medium"]
                      }`}
                    />
                    <span className={`flex-1 text-sm ${t.completed ? "line-through text-gray-400" : "text-gray-700 dark:text-gray-200"}`}>
                      {t.title}
                    </span>
                    {t.due_time && (
                      <span className="text-xs text-gray-400">{t.due_time}</span>
                    )}
                    {cat && (
                      <span
                        className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
                        style={{ backgroundColor: cat.color }}
                      >
                        {cat.name}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* 이번 달 요약 */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "이번 달 전체", value: todos.filter(t => { const d = new Date(t.due_date!); return d.getFullYear() === year && d.getMonth() === month; }).length, color: "text-blue-500" },
          { label: "완료", value: todos.filter(t => { const d = new Date(t.due_date!); return d.getFullYear() === year && d.getMonth() === month && t.completed; }).length, color: "text-green-500" },
          { label: "미완료", value: todos.filter(t => { const d = new Date(t.due_date!); return d.getFullYear() === year && d.getMonth() === month && !t.completed; }).length, color: "text-amber-500" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-gray-100 bg-white p-3 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
