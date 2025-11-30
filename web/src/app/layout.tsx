import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { MiniPlayer } from "@/components/layout/MiniPlayer";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "星火 - 红色教育学习平台",
  description: "星火是一款红色教育学习平台，包含英雄人物展示、AI对话、知识卡片学习、答题PK、红色珍藏收集等功能。",
  keywords: ["红色教育", "党史学习", "英雄人物", "革命历史"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased bg-neutral-50">
        <Navigation />
        <main className="min-h-screen pb-20 md:pb-0 md:ml-64">
          {children}
        </main>
        <GlobalSearch />
        <MiniPlayer />
        <Toaster />
      </body>
    </html>
  );
}
