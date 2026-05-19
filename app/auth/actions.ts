"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
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

export async function requestPasswordReset(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  if (!email?.trim()) return { error: "이메일을 입력해 주세요." };

  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`;
  const redirectTo = `${siteUrl}/auth/callback?next=/reset-password`;

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

  if (error) return { error: "이메일 발송 중 오류가 발생했습니다. 다시 시도해 주세요." };

  return { message: "비밀번호 재설정 링크를 이메일로 보냈습니다. 메일함을 확인해 주세요." };
}

export async function updatePassword(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const password = formData.get("password") as string;
  if (!password || password.length < 6)
    return { error: "비밀번호는 6자 이상이어야 합니다." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) return { error: "비밀번호 변경 중 오류가 발생했습니다. 링크가 만료되었을 수 있습니다." };

  redirect("/");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
