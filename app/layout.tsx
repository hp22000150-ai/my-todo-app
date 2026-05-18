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
    default: "My Todo App",
    template: "%s | My Todo App",
  },
  description: "로그인 후 할 일을 관리하고, 카테고리·마감일·검색 기능을 사용하세요.",
  openGraph: {
    title: "My Todo App",
    description: "로그인 후 할 일을 관리하고, 카테고리·마감일·검색 기능을 사용하세요.",
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
