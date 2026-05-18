"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/app/auth/actions";

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(requestPasswordReset, undefined);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900 dark:text-white">
          비밀번호 찾기
        </h1>
        <p className="mb-8 text-center text-sm text-gray-500 dark:text-gray-400">
          가입하신 이메일 주소를 입력하시면<br />재설정 링크를 보내드립니다.
        </p>

        {state?.message ? (
          <div className="rounded-xl bg-green-50 px-6 py-5 text-center dark:bg-green-900/20">
            <p className="text-sm text-green-700 dark:text-green-400">{state.message}</p>
            <Link
              href="/login"
              className="mt-4 inline-block text-sm font-medium text-blue-500 hover:underline"
            >
              로그인으로 돌아가기
            </Link>
          </div>
        ) : (
          <form action={action} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {state?.error && (
              <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-blue-500 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 active:bg-blue-700 disabled:opacity-60"
            >
              {pending ? "발송 중..." : "재설정 링크 보내기"}
            </button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              <Link href="/login" className="font-medium text-blue-500 hover:underline">
                로그인으로 돌아가기
              </Link>
            </p>
          </form>
        )}
      </div>
    </main>
  );
}
