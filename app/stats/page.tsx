import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Todo, Category } from "@/types/todo";
import { logout } from "@/app/auth/actions";
import ThemeToggle from "@/components/ThemeToggle";
import StatsView from "@/components/StatsView";

export default async function StatsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: todos } = await supabase
    .from("todos")
    .select("*")
    .order("created_at", { ascending: true });

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <main className="mx-auto min-h-screen max-w-xl px-4 pt-10 pb-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">나의 일정관리</h1>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {user?.is_anonymous ? "비회원" : user?.email?.split("@")[0]}
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

      {/* 뷰 탭 */}
      <div className="mb-4 flex gap-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
        <Link href="/" className="flex-1 rounded-lg py-1.5 text-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
          목록
        </Link>
        <Link href="/calendar" className="flex-1 rounded-lg py-1.5 text-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
          캘린더
        </Link>
        <span className="flex-1 rounded-lg bg-white py-1.5 text-center text-sm font-medium text-gray-800 shadow-sm dark:bg-gray-700 dark:text-white">
          통계
        </span>
      </div>

      <StatsView
        todos={(todos as Todo[]) ?? []}
        categories={(categories as Category[]) ?? []}
      />
    </main>
  );
}
