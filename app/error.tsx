"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-200">
          문제가 발생했어요
        </h2>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          {error.message || "알 수 없는 오류입니다."}
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
        >
          다시 시도
        </button>
      </div>
    </main>
  );
}
