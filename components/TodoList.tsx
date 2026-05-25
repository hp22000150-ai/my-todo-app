"use client";

import { useState, useOptimistic, startTransition } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Todo, Category, Subtask } from "@/types/todo";
import TodoItem from "./TodoItem";
import { toggleTodo, reorderTodos, deleteCompletedTodos } from "@/app/actions";

const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

function SortableItem({
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
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: todo.id });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="flex items-center gap-1"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none px-1 text-gray-300 hover:text-gray-400 dark:text-gray-600 dark:hover:text-gray-500 active:cursor-grabbing"
        aria-label="드래그로 순서 변경"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
        </svg>
      </button>
      <div className="flex-1">
        <TodoItem todo={todo} categories={categories} subtasks={subtasks} onToggle={onToggle} />
      </div>
    </li>
  );
}

export default function TodoList({
  todos,
  categories,
  subtasks,
}: {
  todos: Todo[];
  categories: Category[];
  subtasks: Subtask[];
}) {
  const [optimisticTodos, setOptimisticCompleted] = useOptimistic(
    todos,
    (state: Todo[], { id, completed }: { id: string; completed: boolean }) =>
      state.map((t) => (t.id === id ? { ...t, completed } : t))
  );

  const [dragOrder, setDragOrder] = useState<string[] | null>(null);
  const [showDone, setShowDone] = useState(false);

  const pending = optimisticTodos.filter((t) => !t.completed);
  const done = optimisticTodos.filter((t) => t.completed);

  const sortedPending = dragOrder
    ? (dragOrder.map((id) => pending.find((t) => t.id === id)).filter(Boolean) as Todo[])
    : [...pending].sort((a, b) => {
        const pa = PRIORITY_ORDER[a.priority ?? "medium"];
        const pb = PRIORITY_ORDER[b.priority ?? "medium"];
        if (pa !== pb) return pa - pb;
        return (a.sort_order ?? 0) - (b.sort_order ?? 0);
      });

  const total = optimisticTodos.length;
  const doneCount = done.length;
  const progress = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  function handleToggle(id: string, currentCompleted: boolean) {
    startTransition(async () => {
      setOptimisticCompleted({ id, completed: !currentCompleted });
      await toggleTodo(id, currentCompleted);
    });
  }

  const sensors = useSensors(useSensor(PointerSensor));

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sortedPending.findIndex((t) => t.id === active.id);
    const newIndex = sortedPending.findIndex((t) => t.id === over.id);
    const reordered = arrayMove(sortedPending, oldIndex, newIndex);

    setDragOrder(reordered.map((t) => t.id));
    await reorderTodos(reordered.map((t) => t.id));
    setDragOrder(null);
  }

  if (optimisticTodos.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-gray-400 dark:text-gray-600">
        할 일이 없습니다. 새 항목을 추가해보세요!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 진행률 바 */}
      <div className="rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-800/50">
        <div className="mb-1.5 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>전체 진행률</span>
          <span className="font-medium">{doneCount} / {total} 완료 ({progress}%)</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 할 일 섹션 */}
      {sortedPending.length > 0 && (
        <section>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-600">
            할 일 ({sortedPending.length})
          </p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sortedPending.map((t) => t.id)} strategy={verticalListSortingStrategy}>
              <ul className="space-y-2">
                {sortedPending.map((todo) => (
                  <SortableItem key={todo.id} todo={todo} categories={categories} subtasks={subtasks.filter(s => s.todo_id === todo.id)} onToggle={handleToggle} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </section>
      )}

      {/* 완료 섹션 */}
      {done.length > 0 && (
        <section>
          <div className="mb-2 flex items-center justify-between">
          <button
            onClick={() => setShowDone((v) => !v)}
            className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-400"
          >
            <svg
              className={`h-3 w-3 transition-transform ${showDone ? "rotate-90" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            완료 ({done.length})
          </button>
          <button
            onClick={() => deleteCompletedTodos()}
            className="text-xs text-gray-300 hover:text-red-400 dark:text-gray-600 dark:hover:text-red-500 transition-colors"
          >
            전체 삭제
          </button>
          </div>
          {showDone && (
            <ul className="space-y-2">
              {done.map((todo) => (
                <li key={todo.id} className="flex items-center gap-1">
                  <span className="w-6" />
                  <div className="flex-1">
                    <TodoItem todo={todo} categories={categories} subtasks={subtasks.filter(s => s.todo_id === todo.id)} onToggle={handleToggle} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
