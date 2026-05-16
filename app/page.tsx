import { createClient } from "@/lib/supabase/server";
import { Todo } from "@/types/todo";
import AddTodo from "@/components/AddTodo";
import TodoList from "@/components/TodoList";

export default async function Home() {
  const supabase = await createClient();
  const { data: todos } = await supabase
    .from("todos")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto min-h-screen max-w-xl px-4 py-16">
      <h1 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
        할 일 목록
      </h1>

      <div className="space-y-6">
        <AddTodo />
        <TodoList todos={(todos as Todo[]) ?? []} />
      </div>
    </main>
  );
}
