"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Target,
  Brain,
  Flame,
  Mail,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  Award,
  BookOpen,
  Check,
} from "lucide-react";

export function LandingView() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. Header / Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="container mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Zap className="w-4 h-4 fill-current text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">
              Multitrack
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 text-xs font-medium text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">
              Tính năng
            </a>
            <a href="#feynman" className="hover:text-indigo-600 transition-colors">
              Phương pháp Feynman
            </a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">
              Cách hoạt động
            </a>
          </nav>

          <div className="flex items-center space-x-2">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-xs font-medium text-slate-700 hover:bg-slate-100">
                Đăng nhập
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm">
                Bắt đầu miễn phí <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          {/* Top Pill Badge */}
          <div className="fade-up inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Kết hợp Feynman Technique & Gamification</span>
          </div>

          {/* H1 Headline */}
          <h1 className="fade-up fade-up-delay-1 text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 max-w-3xl mx-auto leading-tight sm:leading-tight">
            Học Nhiều Kỹ Năng Cùng Lúc Mà <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Không Bị Bội Thực</span>
          </h1>

          {/* Subtitle */}
          <p className="fade-up fade-up-delay-2 text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-4 leading-relaxed">
            Theo dõi nhiều lộ trình học tập song song, chủ động tìm lỗ hổng kiến thức bằng kỹ thuật Feynman và duy trì thói quen mỗi ngày với hệ thống Streak & EXP.
          </p>

          {/* Hero CTAs */}
          <div className="fade-up fade-up-delay-3 flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-6 h-11 shadow-sm transition-all">
                Tạo lộ trình học ngay <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-200 text-slate-700 hover:bg-slate-100 text-sm h-11">
                Xem cách hoạt động
              </Button>
            </a>
          </div>

          {/* Hero Product Card Demo Mockup */}
          <div className="fade-up fade-up-delay-3 mt-12 relative max-w-3xl mx-auto">
            <div className="p-1 rounded-2xl bg-gradient-to-b from-slate-200/80 to-slate-100 shadow-xl border border-slate-200/60">
              <div className="bg-white rounded-xl p-5 text-left border border-slate-100 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="text-xs font-semibold text-slate-400 ml-2">Multitrack App Preview</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    🔥 Global Streak: 14 Days
                  </span>
                </div>

                {/* Sample Track Row inside Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">IELTS 8.0 Intensive</h4>
                      <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">Active</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Listening & Speaking Feynman explanation</p>
                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="font-semibold text-slate-700">🔥 14 ngày streak</span>
                      <span className="text-indigo-600 font-bold">+150 EXP</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">React & System Design</h4>
                      <span className="text-[10px] font-semibold bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded">Active</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Mastering Microservices Architecture</p>
                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="font-semibold text-slate-700">🔥 8 ngày streak</span>
                      <span className="text-indigo-600 font-bold">+200 EXP</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Problem vs Solution Section */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Tại sao cách học mục tiêu truyền thống thường thất bại?
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Hầu hết mọi người bỏ cuộc không phải vì lười biếng, mà vì thiếu hệ thống theo dõi đúng đắn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Problem Card */}
            <div className="p-6 rounded-xl bg-red-50/50 border border-red-100 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                <span className="font-bold text-sm">✕</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">Cách theo dõi cũ</h3>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-red-500">►</span> Học vẹt kiến thức nhưng không thực sự hiểu bản chất.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">►</span> Dễ bỏ dở khi học nhiều môn cùng lúc do quá tải.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">►</span> Thiếu động lực duy trì thói quen hàng ngày.
                </li>
              </ul>
            </div>

            {/* Solution Card */}
            <div className="p-6 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Giải pháp Multitrack</h3>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600">✓</span> Ép bản thân giải thích đơn giản ➔ Phát hiện ngay lỗ hổng (Feynman).
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600">✓</span> Quản lý các Track song song mượt mà, rõ ràng.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600">✓</span> Thưởng EXP, bảo vệ Streak 🔥 và tự động gửi Email nhắc nhở.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Features Bento Grid */}
      <section id="features" className="py-16 sm:py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Tính năng nổi bật</span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl mt-1">
              Mọi công cụ bạn cần để làm chủ việc tự học
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Feature 1 */}
            <div className="md:col-span-2 p-6 rounded-xl bg-white border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Kỹ thuật Feynman Check-in</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Mỗi bài Check-in yêu cầu bạn diễn đạt bài học theo cách đơn giản nhất như đang dạy lại cho một đứa trẻ. Nhờ đó, các lỗ hổng kiến thức (Gaps) lập tức lộ diện để bạn củng cố.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl bg-white border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Streak & Level System</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tích lũy điểm EXP mỗi ngày, tăng cấp Level cá nhân và chinh phục bộ Huy hiệu (Badges) danh giá.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl bg-white border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Parallel Track Tracker</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Quản lý đồng thời nhiều mục tiêu khác nhau (Tiếng Anh, Lập trình, Thể thao) mà không bị nhầm lẫn.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="md:col-span-2 p-6 rounded-xl bg-white border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-9 h-9 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Nhắc nhở tự động qua Email lúc 8h tối</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Hệ thống tự động quét các Track bị bỏ bê quá 24h và gửi 1 email nhắc nhở tổng hợp lúc 20:00 mỗi ngày để bạn kịp thời điểm danh bảo vệ Streak.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section id="how-it-works" className="py-16 bg-white border-t border-slate-200/80">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Quy trình đơn giản</span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl mt-1">
              3 Bước Để Làm Chủ Kỹ Năng Mới
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mx-auto mb-3">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900">Tạo Lộ Trình (Track)</h3>
              <p className="text-xs text-slate-500">Tạo các Track học tập và gắn Milestones/Concepts cần đạt.</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mx-auto mb-3">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900">Check-in Feynman</h3>
              <p className="text-xs text-slate-500">Điểm danh mỗi ngày và viết lời giải thích đơn giản cho khái niệm.</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mx-auto mb-3">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900">Thăng Cấp & Nhận Badge</h3>
              <p className="text-xs text-slate-500">Thu thập EXP, tăng Level cá nhân và tích lũy chuỗi Streak 🔥.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Final CTA Banner */}
      <section className="py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="p-8 sm:p-10 rounded-2xl bg-indigo-600 text-white text-center shadow-lg space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Sẵn sàng làm chủ lộ trình học tập của bạn?
            </h2>
            <p className="text-indigo-100 text-xs sm:text-sm max-w-xl mx-auto">
              Tham gia Multitrack ngay hôm nay. Hoàn toàn miễn phí và không cần thẻ tín dụng.
            </p>
            <div className="pt-2">
              <Link href="/signup">
                <Button size="lg" className="bg-white hover:bg-slate-100 text-indigo-600 font-bold text-sm px-6 h-11 shadow-sm">
                  Tạo tài khoản miễn phí <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="py-8 bg-white border-t border-slate-200 text-center text-xs text-slate-500">
        <div className="container mx-auto max-w-5xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-slate-900">Multitrack</span>
            <span>— Goal & Skill Habit Tracker</span>
          </div>
          <p>© {new Date().getFullYear()} Multitrack. Built with Next.js & Spring Boot.</p>
        </div>
      </footer>
    </div>
  );
}
