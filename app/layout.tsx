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
        <footer className="py-4 text-center text-xs text-gray-400 dark:text-gray-600">
          Produced by CONTENT FACTORY · 2026.05.18
        </footer>
      </body>
    </html>
  );
}
