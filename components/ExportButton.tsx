"use client";

import { Todo, Category } from "@/types/todo";

const PRIORITY_LABEL: Record<string, string> = { high: "높음", medium: "보통", low: "낮음" };

function recurringLabel(todo: Todo) {
  if (!todo.is_recurring) return "";
  if (todo.recurrence_days === 1) return "매일";
  if (todo.recurrence_days === 7) return "매주";
  if (todo.recurrence_days === 14) return "격주";
  if (todo.recurrence_days === 30) return "매월";
  return `${todo.recurrence_days}일마다`;
}

export default function ExportButton({
  todos,
  categories,
}: {
  todos: Todo[];
  categories: Category[];
}) {
  function handleExport() {
    const headers = ["제목", "우선순위", "마감일", "시간", "카테고리", "완료여부", "메모", "반복", "생성일"];

    const rows = todos.map((todo) => {
      const category = categories.find((c) => c.id === todo.category_id);
      const dueDate = todo.due_date
        ? new Date(todo.due_date).toLocaleDateString("ko-KR")
        : "";
      const createdAt = new Date(todo.created_at).toLocaleDateString("ko-KR");

      return [
        todo.title,
        PRIORITY_LABEL[todo.priority ?? "medium"],
        dueDate,
        todo.due_time ?? "",
        category?.name ?? "",
        todo.completed ? "완료" : "미완료",
        todo.note ?? "",
        recurringLabel(todo),
        createdAt,
      ];
    });

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const BOM = "﻿";
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const date = new Date().toLocaleDateString("ko-KR").replace(/\. /g, "-").replace(".", "");
    a.href = url;
    a.download = `나의일정관리_${date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleExport}
      aria-label="CSV 내보내기"
      title="CSV로 내보내기"
      className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
    >
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      내보내기
    </button>
  );
}
