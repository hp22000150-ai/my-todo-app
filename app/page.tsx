import { createClient } from "@/lib/supabase/server";
import { Todo } from "@/types/todo";
import { logout } from "@/app/auth/actions";
import AddTodo from "@/components/AddTodo";
import TodoList from "@/components/TodoList";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: todos } = await supabase
    .from("todos")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto min-h-screen max-w-xl px-4 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          할 일 목록
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

      <div className="space-y-6">
        <AddTodo />
        <TodoList todos={(todos as Todo[]) ?? []} />
      </div>
    </main>
  );
}
