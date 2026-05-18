"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useRef, useTransition } from "react";
import { Category } from "@/types/todo";
import { addCategory, deleteCategory } from "@/app/categories/actions";

const PRESET_COLORS = [
  "#ef4444", "#f97316", "#eab308",
  "#22c55e", "#3b82f6", "#8b5cf6",
  "#ec4899", "#6b7280",
];

export default function CategoryFilter({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const activeCategory = searchParams.get("category");

  function handleFilter(categoryId: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId) {
      params.set("category", categoryId);
    } else {
      params.delete("category");
    }
    startTransition(() => router.replace(`${pathname}?${params.toString()}`));
  }

  async function handleAdd(formData: FormData) {
    await addCategory(formData);
    formRef.current?.reset();
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleFilter(null)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            !activeCategory
              ? "bg-gray-800 text-white dark:bg-white dark:text-gray-900"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          전체
        </button>
        {categories.map((cat) => (
          <div key={cat.id} className="group relative flex items-center">
            <button
              onClick={() => handleFilter(cat.id)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeCategory === cat.id
                  ? "text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
              }`}
              style={activeCategory === cat.id ? { backgroundColor: cat.color } : {}}
            >
              <span
                className="h-2 w-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              {cat.name}
            </button>
            <button
              onClick={() => deleteCategory(cat.id)}
              className="absolute -right-1 -top-1 hidden h-4 w-4 items-center justify-center rounded-full bg-gray-400 text-white text-xs group-hover:flex hover:bg-red-500"
              aria-label="카테고리 삭제"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <form ref={formRef} action={handleAdd} className="flex items-center gap-2">
        <input
          name="name"
          type="text"
          placeholder="새 카테고리..."
          maxLength={20}
          className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
        <div className="flex gap-1">
          {PRESET_COLORS.map((c) => (
            <label key={c} className="relative cursor-pointer">
              <input type="radio" name="color" value={c} className="sr-only peer" defaultChecked={c === "#3b82f6"} />
              <span
                className="block h-5 w-5 rounded-full ring-2 ring-transparent peer-checked:ring-offset-1 peer-checked:ring-gray-400"
                style={{ backgroundColor: c }}
              />
            </label>
          ))}
        </div>
        <button
          type="submit"
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
        >
          추가
        </button>
      </form>
    </div>
  );
}
