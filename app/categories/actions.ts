"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const color = formData.get("color") as string;
  if (!name?.trim()) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("categories")
    .insert({ name: name.trim(), color: color || "#6b7280", user_id: user.id });

  revalidatePath("/");
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/");
}
