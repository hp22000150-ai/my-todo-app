import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { Todo, Category } from "@/types/todo";
import { logout } from "@/app/auth/actions";
import AddTodo from "@/components/AddTodo";
import TodoList from "@/components/TodoList";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: true });

  let query = supabase
    .from("todos")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (q) query = query.ilike("title", `%${q}%`);
  if (category) query = query.eq("category_id", category);

  const { data: todos } = await query;

  return (
    <main className="mx-auto min-h-screen max-w-xl px-4 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          나의 일정관리
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {user?.email}
          </span>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              로그아웃
            </button>
          </form>
        </div>
      </div>

      <div className="space-y-4">
        <AddTodo categories={(categories as Category[]) ?? []} />

        <Suspense>
          <SearchBar />
        </Suspense>

        <Suspense>
          <CategoryFilter categories={(categories as Category[]) ?? []} />
        </Suspense>

        <TodoList
          todos={(todos as Todo[]) ?? []}
          categories={(categories as Category[]) ?? []}
        />
      </div>
    </main>
  );
}
