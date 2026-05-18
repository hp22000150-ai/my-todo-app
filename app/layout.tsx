import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "나의 일정관리",
    template: "%s | 나의 일정관리",
  },
  description: "나의 일정을 스마트하게 관리하세요. 카테고리·마감일·시간 설정·검색 기능 제공.",
  openGraph: {
    title: "나의 일정관리",
    description: "나의 일정을 스마트하게 관리하세요. 카테고리·마감일·시간 설정·검색 기능 제공.",
    type: "website",
    locale: "ko_KR",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 dark:bg-gray-900">
        <div className="flex-1">{children}</div>
        <footer className="space-y-2 py-5 text-center text-xs text-gray-400 dark:text-gray-600">
          <div className="group relative inline-block">
            <span className="cursor-help border-b border-dashed border-gray-300 pb-px dark:border-gray-600">
              앱 사용 방법
            </span>
            <div className="pointer-events-none absolute bottom-full left-1/2 mb-3 hidden w-72 -translate-x-1/2 rounded-xl border border-gray-200 bg-white p-4 text-left shadow-2xl group-hover:block dark:border-gray-700 dark:bg-gray-800">
              <p className="mb-3 font-semibold text-gray-700 dark:text-gray-200">📋 나의 일정관리 사용법</p>
              <ul className="space-y-1.5 text-gray-500 dark:text-gray-400">
                <li>✅ <b>동그라미 버튼</b> — 일정 완료 / 취소</li>
                <li>✏️ <b>연필 아이콘</b> — 제목·날짜·시간 수정</li>
                <li>🗑️ <b>X 아이콘</b> — 일정 삭제</li>
                <li>☰ <b>드래그 핸들</b> — 순서 변경</li>
                <li>🏷️ <b>카테고리</b> — 색깔별 분류 및 필터</li>
                <li>🔍 <b>검색창</b> — 키워드로 일정 검색</li>
                <li>📅 <b>D-day 뱃지</b> — 마우스 올리면 달력 표시</li>
                <li>🔁 <b>반복 설정</b> — 완료 시 다음 주기 자동 생성</li>
              </ul>
              <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800" />
            </div>
          </div>
          <p>Produced by CONTENT FACTORY · 2026.05.18</p>
        </footer>
      </body>
    </html>
  );
}
