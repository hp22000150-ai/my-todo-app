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
import { Todo, Category } from "@/types/todo";
import TodoItem from "./TodoItem";
import { toggleTodo, reorderTodos } from "@/app/actions";

function SortableItem({
  todo,
  categories,
  onToggle,
}: {
  todo: Todo;
  categories: Category[];
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
        <TodoItem todo={todo} categories={categories} onToggle={onToggle} />
      </div>
    </li>
  );
}

export default function TodoList({
  todos,
  categories,
}: {
  todos: Todo[];
  categories: Category[];
}) {
  const [optimisticTodos, setOptimisticCompleted] = useOptimistic(
    todos,
    (state: Todo[], { id, completed }: { id: string; completed: boolean }) =>
      state.map((t) => (t.id === id ? { ...t, completed } : t))
  );

  const [dragOrder, setDragOrder] = useState<string[] | null>(null);

  const pending = optimisticTodos.filter((t) => !t.completed);
  const done = optimisticTodos.filter((t) => t.completed);

  const pendingItems = dragOrder
    ? dragOrder.map((id) => pending.find((t) => t.id === id)).filter((t): t is Todo => !!t)
    : pending;

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

    const oldIndex = pendingItems.findIndex((t) => t.id === active.id);
    const newIndex = pendingItems.findIndex((t) => t.id === over.id);
    const reordered = arrayMove(pendingItems, oldIndex, newIndex);

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
      {pendingItems.length > 0 && (
        <section>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-600">
            할 일 ({pendingItems.length})
          </p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={pendingItems.map((t) => t.id)} strategy={verticalListSortingStrategy}>
              <ul className="space-y-2">
                {pendingItems.map((todo) => (
                  <SortableItem key={todo.id} todo={todo} categories={categories} onToggle={handleToggle} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </section>
      )}

      {done.length > 0 && (
        <section>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-600">
            완료 ({done.length})
          </p>
          <ul className="space-y-2">
            {done.map((todo) => (
              <li key={todo.id} className="flex items-center gap-1">
                <span className="w-6" />
                <div className="flex-1">
                  <TodoItem todo={todo} categories={categories} onToggle={handleToggle} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
