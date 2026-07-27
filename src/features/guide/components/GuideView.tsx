"use client";

import { useState, useMemo } from "react";
import { useLocaleContext } from "@/components/I18nProvider";
import { marked } from "marked";
import { BookOpen, Brain, Flame, HelpCircle, ChevronRight, List } from "lucide-react";

import {
  gettingStartedEn,
  gettingStartedVi,
  feynmanMethodEn,
  feynmanMethodVi,
  gamificationEn,
  gamificationVi,
  faqEn,
  faqVi,
} from "@/content/guide";

type TopicId = "getting-started" | "feynman-method" | "gamification" | "faq";

interface Topic {
  id: TopicId;
  titleEn: string;
  titleVi: string;
  icon: any;
  contentEn: string;
  contentVi: string;
}

const TOPICS: Topic[] = [
  {
    id: "getting-started",
    titleEn: "Getting Started",
    titleVi: "Hướng dẫn bắt đầu",
    icon: BookOpen,
    contentEn: gettingStartedEn,
    contentVi: gettingStartedVi,
  },
  {
    id: "feynman-method",
    titleEn: "Feynman Technique",
    titleVi: "Phương pháp Feynman",
    icon: Brain,
    contentEn: feynmanMethodEn,
    contentVi: feynmanMethodVi,
  },
  {
    id: "gamification",
    titleEn: "EXP & Gamification",
    titleVi: "EXP & Chuỗi Streak",
    icon: Flame,
    contentEn: gamificationEn,
    contentVi: gamificationVi,
  },
  {
    id: "faq",
    titleEn: "Frequently Asked Questions",
    titleVi: "Câu hỏi thường gặp",
    icon: HelpCircle,
    contentEn: faqEn,
    contentVi: faqVi,
  },
];

export function GuideView() {
  const { locale } = useLocaleContext();
  const [activeTopicId, setActiveTopicId] = useState<TopicId>("getting-started");

  const currentTopic = TOPICS.find((t) => t.id === activeTopicId) || TOPICS[0];
  const markdownText = locale === "vi" ? currentTopic.contentVi : currentTopic.contentEn;

  // Convert markdown to HTML string
  const htmlContent = useMemo(() => {
    return marked.parse(markdownText || "") as string;
  }, [markdownText]);

  // Extract H2 headings for Table of Contents
  const headings = useMemo(() => {
    const regex = /^##\s+(.+)$/gm;
    const matches: string[] = [];
    let match;
    while ((match = regex.exec(markdownText || "")) !== null) {
      matches.push(match[1].replace(/[\#\*\`]/g, ""));
    }
    return matches;
  }, [markdownText]);

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="fade-up mb-8 pb-4 border-b border-slate-200/80">
        <div className="flex items-center space-x-2 text-indigo-600 mb-1">
          <BookOpen className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">
            {locale === "vi" ? "Tài Liệu Hướng Dẫn" : "Documentation Guide"}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          {locale === "vi" ? "Trung Tâm Hướng Dẫn Multitrack" : "Multitrack User Guide"}
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          {locale === "vi"
            ? "Mọi thông tin bạn cần để làm chủ lộ trình tự học và duy trì thói quen mỗi ngày."
            : "Everything you need to master your learning tracks and build daily habits."}
        </p>
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Column 1: Left Navigation Sidebar (3 cols) */}
        <aside className="md:col-span-3 space-y-1 sticky top-20 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 mb-1">
            {locale === "vi" ? "CHỦ ĐỀ HƯỚNG DẪN" : "GUIDE TOPICS"}
          </h2>
          {TOPICS.map((topic) => {
            const Icon = topic.icon;
            const isActive = topic.id === activeTopicId;
            return (
              <button
                key={topic.id}
                onClick={() => setActiveTopicId(topic.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 shadow-2xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                  <span className="truncate">{locale === "vi" ? topic.titleVi : topic.titleEn}</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-indigo-600" : "opacity-0"}`} />
              </button>
            );
          })}
        </aside>

        {/* Column 2: Main Content Article (6 or 7 cols) */}
        <main className="md:col-span-6 lg:col-span-7 bg-white p-6 sm:p-8 rounded-xl border border-slate-200/80 shadow-xs">
          <article
            className="markdown-body"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </main>

        {/* Column 3: Right Table of Contents Sidebar (3 cols - Desktop only) */}
        <aside className="hidden lg:block lg:col-span-2 space-y-3 sticky top-20 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
          <div className="flex items-center space-x-1.5 text-slate-500 text-xs font-semibold">
            <List className="w-3.5 h-3.5 text-indigo-600" />
            <span>{locale === "vi" ? "Mục lục trang" : "On This Page"}</span>
          </div>
          {headings.length > 0 ? (
            <ul className="space-y-1.5 text-[11px] text-slate-500 border-l border-slate-200 pl-3">
              {headings.map((heading, idx) => (
                <li key={idx} className="hover:text-indigo-600 transition-colors line-clamp-1">
                  {heading}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[11px] text-slate-400 italic">
              {locale === "vi" ? "Không có mục lục" : "No sections"}
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
