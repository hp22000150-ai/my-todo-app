"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addTodo(formData: FormData) {
  const title = formData.get("title") as string;
  if (!title?.trim()) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const dueDate = formData.get("due_date") as string;
  const dueTime = formData.get("due_time") as string;
  const categoryId = formData.get("category_id") as string;
  const priority = (formData.get("priority") as string) || "medium";
  const note = (formData.get("note") as string) || null;
  const isRecurring = formData.get("is_recurring") === "on";
  const recurrenceDays = isRecurring
    ? parseInt(formData.get("recurrence_days") as string) || 7
    : null;

  const { data: last } = await supabase
    .from("todos")
    .select("sort_order")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  const nextOrder = (last?.sort_order ?? 0) + 1;

  await supabase.from("todos").insert({
    title: title.trim(),
    user_id: user.id,
    due_date: dueDate || null,
    due_time: (dueDate && dueTime) ? dueTime : null,
    category_id: categoryId || null,
    priority,
    note: note || null,
    sort_order: nextOrder,
    is_recurring: isRecurring,
    recurrence_days: recurrenceDays,
  });

  revalidatePath("/");
}

export async function toggleTodo(id: string, completed: boolean) {
  const supabase = await createClient();

  if (!completed) {
    // 완료로 전환 시 반복 할 일이면 다음 주기 자동 생성
    const { data: todo } = await supabase
      .from("todos")
      .select("*")
      .eq("id", id)
      .single();

    if (todo?.is_recurring && todo.recurrence_days && todo.due_date) {
      const nextDue = new Date(todo.due_date);
      nextDue.setDate(nextDue.getDate() + todo.recurrence_days);

      await supabase.from("todos").insert({
        title: todo.title,
        user_id: todo.user_id,
        due_date: nextDue.toISOString(),
        category_id: todo.category_id,
        sort_order: (todo.sort_order ?? 0) + 0.5,
        is_recurring: true,
        recurrence_days: todo.recurrence_days,
      });
    }
  }

  await supabase.from("todos").update({ completed: !completed }).eq("id", id);
  revalidatePath("/");
}

export async function updateTodo(
  id: string,
  title: string,
  dueDate?: string | null,
  dueTime?: string | null,
  priority?: string | null,
  note?: string | null,
  categoryId?: string | null,
) {
  if (!title?.trim()) return;
  const supabase = await createClient();
  const patch: Record<string, unknown> = { title: title.trim() };
  if (dueDate !== undefined) {
    patch.due_date = dueDate || null;
    patch.due_time = (dueDate && dueTime) ? dueTime : null;
  }
  if (priority !== undefined) patch.priority = priority || "medium";
  if (note !== undefined) patch.note = note || null;
  if (categoryId !== undefined) patch.category_id = categoryId || null;
  await supabase.from("todos").update(patch).eq("id", id);
  revalidatePath("/");
}

export async function deleteTodo(id: string) {
  const supabase = await createClient();
  await supabase.from("todos").delete().eq("id", id);
  revalidatePath("/");
}

export async function deleteCompletedTodos() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("todos").delete().eq("user_id", user.id).eq("completed", true);
  revalidatePath("/");
}

export async function reorderTodos(ids: string[]) {
  const supabase = await createClient();
  await Promise.all(
    ids.map((id, index) =>
      supabase.from("todos").update({ sort_order: index }).eq("id", id)
    )
  );
  revalidatePath("/");
}

export async function addSubtask(todoId: string, title: string) {
  if (!title.trim()) return;
  const supabase = await createClient();
  const { data: last } = await supabase
    .from("subtasks")
    .select("sort_order")
    .eq("todo_id", todoId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();
  await supabase.from("subtasks").insert({
    todo_id: todoId,
    title: title.trim(),
    sort_order: (last?.sort_order ?? -1) + 1,
  });
  revalidatePath("/");
  revalidatePath("/calendar");
}

export async function toggleSubtask(id: string, completed: boolean) {
  const supabase = await createClient();
  await supabase.from("subtasks").update({ completed: !completed }).eq("id", id);
  revalidatePath("/");
  revalidatePath("/calendar");
}

export async function deleteSubtask(id: string) {
  const supabase = await createClient();
  await supabase.from("subtasks").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/calendar");
}
