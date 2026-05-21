"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";
import { Todo, Category } from "@/types/todo";

export default function StatsView({
  todos,
  categories,
}: {
  todos: Todo[];
  categories: Category[];
}) {
  const total = todos.length;
  const done = todos.filter((t) => t.completed).length;
  const rate = total > 0 ? Math.round((done / total) * 100) : 0;

  // 최근 7일 완료 추이
  const today = new Date();
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const pad = (n: number) => String(n).padStart(2, "0");
    const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const dayTodos = todos.filter((t) => {
      const c = new Date(t.created_at);
      const cs = `${c.getFullYear()}-${pad(c.getMonth() + 1)}-${pad(c.getDate())}`;
      return cs === dateStr;
    });
    return {
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      전체: dayTodos.length,
      완료: dayTodos.filter((t) => t.completed).length,
    };
  });

  // 우선순위 분포
  const priorityData = [
    { name: "높음", value: todos.filter((t) => t.priority === "high").length, fill: "#f87171" },
    { name: "보통", value: todos.filter((t) => !t.priority || t.priority === "medium").length, fill: "#fbbf24" },
    { name: "낮음", value: todos.filter((t) => t.priority === "low").length, fill: "#4ade80" },
  ].filter((d) => d.value > 0);

  // 카테고리별 완료율
  const categoryStats = categories.map((cat) => {
    const catTodos = todos.filter((t) => t.category_id === cat.id);
    const catDone = catTodos.filter((t) => t.completed).length;
    return {
      name: cat.name,
      전체: catTodos.length,
      완료: catDone,
      color: cat.color,
    };
  }).filter((c) => c.전체 > 0);

  return (
    <div className="space-y-6">
      {/* 요약 카드 */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "전체 할 일", value: total, color: "text-blue-500" },
          { label: "완료", value: done, color: "text-green-500" },
          { label: "완료율", value: `${rate}%`, color: "text-purple-500" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      {/* 전체 완료율 바 */}
      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200">전체 완료율</p>
        <div className="relative h-4 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-700"
            style={{ width: `${rate}%` }}
          />
        </div>
        <p className="mt-2 text-right text-xs text-gray-400">{done} / {total} 완료</p>
      </div>

      {/* 최근 7일 추이 */}
      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <p className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-200">최근 7일 추이</p>
        {last7.every((d) => d.전체 === 0) ? (
          <p className="py-4 text-center text-sm text-gray-400">최근 7일간 데이터가 없습니다.</p>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={last7} barCategoryGap="30%">
              <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, fontSize: 12, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}
              />
              <Bar dataKey="전체" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              <Bar dataKey="완료" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* 우선순위 분포 */}
      {priorityData.length > 0 && (
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-200">우선순위 분포</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={140}>
              <PieChart>
                <Pie data={priorityData} dataKey="value" cx="50%" cy="50%" innerRadius={35} outerRadius={60}>
                  {priorityData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2">
              {priorityData.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.fill }} />
                  <span className="text-xs text-gray-600 dark:text-gray-300">{d.name}</span>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">{d.value}개</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 카테고리별 현황 */}
      {categoryStats.length > 0 && (
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-200">카테고리별 현황</p>
          <div className="space-y-3">
            {categoryStats.map((c) => {
              const pct = c.전체 > 0 ? Math.round((c.완료 / c.전체) * 100) : 0;
              return (
                <div key={c.name}>
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{c.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">{c.완료}/{c.전체} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: c.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
