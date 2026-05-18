"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string } | undefined;

export async function login(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    if (error.message.includes("Invalid login credentials"))
      return { error: "이메일 또는 비밀번호가 올바르지 않습니다." };
    if (error.message.includes("rate limit"))
      return { error: "잠시 후 다시 시도해 주세요." };
    return { error: "로그인 중 오류가 발생했습니다. 다시 시도해 주세요." };
  }

  redirect("/");
}

export async function signup(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    if (error.message === "User already registered")
      return { error: "이미 가입된 이메일입니다. 로그인 페이지에서 로그인해 주세요." };
    if (error.message.includes("Password should be at least"))
      return { error: "비밀번호는 6자 이상이어야 합니다." };
    if (error.message.includes("rate limit"))
      return { error: "잠시 후 다시 시도해 주세요." };
    return { error: "회원가입 중 오류가 발생했습니다. 다시 시도해 주세요." };
  }

  return { message: "이메일을 확인해 계정을 활성화하세요." };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
