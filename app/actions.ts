"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addTodo(formData: FormData) {
  const title = formData.get("title") as string;
  if (!title?.trim()) return;

  const supabase = await createClient();
  await supabase.from("todos").insert({ title: title.trim() });
  revalidatePath("/");
}

export async function toggleTodo(id: string, completed: boolean) {
  const supabase = await createClient();
  await supabase.from("todos").update({ completed: !completed }).eq("id", id);
  revalidatePath("/");
}

export async function deleteTodo(id: string) {
  const supabase = await createClient();
  await supabase.from("todos").delete().eq("id", id);
  revalidatePath("/");
}
