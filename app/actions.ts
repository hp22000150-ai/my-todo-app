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
    sort_order: nextOrder,
  });

  revalidatePath("/");
}

export async function toggleTodo(id: string, completed: boolean) {
  const supabase = await createClient();
  await supabase.from("todos").update({ completed: !completed }).eq("id", id);
  revalidatePath("/");
}

export async function updateTodo(id: string, title: string) {
  if (!title?.trim()) return;
  const supabase = await createClient();
  await supabase.from("todos").update({ title: title.trim() }).eq("id", id);
  revalidatePath("/");
}

export async function deleteTodo(id: string) {
  const supabase = await createClient();
  await supabase.from("todos").delete().eq("id", id);
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
