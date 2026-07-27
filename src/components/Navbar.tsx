"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { tokenStorage } from "@/lib/token";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { OnboardingTourDialog } from "@/components/OnboardingTourDialog";
import { LogOut, LayoutDashboard, Zap, User, BookOpen, HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const t = useTranslations("nav");
  const [hasToken, setHasToken] = useState<boolean>(true);
  const [showTour, setShowTour] = useState<boolean>(false);

  useEffect(() => {
    setHasToken(tokenStorage.hasToken());
  }, [pathname]);

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname === "/verify-email";

  // Hide top app navbar on auth pages or unauthenticated landing page
  if (isAuthPage || (!hasToken && pathname === "/")) return null;

  const handleLogout = () => {
    tokenStorage.clear();
    queryClient.clear();
    window.location.href = "/login";
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="container mx-auto max-w-5xl px-4 h-13 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-6.5 h-6.5 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Zap className="w-3.5 h-3.5 fill-current text-white" />
            </div>
            <span className="font-semibold text-base tracking-tight text-slate-900">
              Multitrack
            </span>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center space-x-1">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className={`text-xs font-medium h-8 px-3 ${
                  pathname === "/"
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                {t("dashboard")}
              </Button>
            </Link>

            <Link href="/profile">
              <Button
                variant="ghost"
                size="sm"
                className={`text-xs font-medium h-8 px-3 ${
                  pathname === "/profile"
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <User className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                {t("profile")}
              </Button>
            </Link>

            <Link href="/guide">
              <Button
                variant="ghost"
                size="sm"
                className={`text-xs font-medium h-8 px-3 ${
                  pathname === "/guide"
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                {t("guide")}
              </Button>
            </Link>
          </nav>

          {/* Right side controls: Tour Help + Language Switcher + Logout */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTour(true)}
              className="text-xs h-8 px-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              title="Xem lại Tour Hướng dẫn"
            >
              <HelpCircle className="w-4 h-4 text-indigo-600" />
            </Button>

            <LanguageSwitcher />

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-xs h-8 px-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              <span className="hidden sm:inline">{t("logout")}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Manual Trigger Tour Modal */}
      <OnboardingTourDialog open={showTour} onOpenChange={setShowTour} />
    </>
  );
}
