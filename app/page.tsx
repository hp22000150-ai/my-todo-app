import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { Todo, Category } from "@/types/todo";
import { logout } from "@/app/auth/actions";
import AddTodo from "@/components/AddTodo";
import TodoList from "@/components/TodoList";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import ThemeToggle from "@/components/ThemeToggle";

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
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            나의 일정관리
          </h1>
          <div className="group relative mt-1 inline-block">
            <span className="cursor-help border-b border-dashed border-gray-300 pb-px text-xs text-gray-400 dark:border-gray-600 dark:text-gray-500">
              앱 사용 방법
            </span>
            <div className="pointer-events-none absolute left-0 top-full z-20 mt-2 hidden w-72 rounded-xl border border-gray-200 bg-white p-4 text-left shadow-2xl group-hover:block dark:border-gray-700 dark:bg-gray-800">
              <p className="mb-3 text-xs font-semibold text-gray-700 dark:text-gray-200">📋 나의 일정관리 사용법</p>
              <ul className="space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
                <li>✅ <b>동그라미 버튼</b> — 일정 완료 / 취소</li>
                <li>✏️ <b>연필 아이콘</b> — 제목·날짜·시간·우선순위·메모 수정</li>
                <li>🗑️ <b>X 아이콘</b> — 일정 삭제</li>
                <li>☰ <b>드래그 핸들</b> — 순서 변경</li>
                <li>🔴 <b>우선순위</b> — 높음·보통·낮음 설정, 자동 정렬</li>
                <li>🏷️ <b>카테고리</b> — 색깔별 분류 및 필터</li>
                <li>🔍 <b>검색창</b> — 키워드로 일정 검색</li>
                <li>📅 <b>D-day 뱃지</b> — 마우스 올리면 달력 표시</li>
                <li>🔁 <b>반복 설정</b> — 완료 시 다음 주기 자동 생성</li>
                <li>📊 <b>진행률 바</b> — 전체 완료 현황 표시</li>
                <li>🌙 <b>달/해 버튼</b> — 다크/라이트 모드 전환</li>
              </ul>
              <div className="absolute -top-1.5 left-6 h-3 w-3 rotate-45 border-l border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
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
