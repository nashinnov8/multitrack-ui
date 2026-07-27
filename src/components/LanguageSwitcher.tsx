"use client";

import { useLocaleContext } from "./I18nProvider";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocaleContext();

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "vi" : "en";
    setLocale(nextLocale);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="h-8 px-2 text-xs font-semibold text-slate-700 hover:bg-slate-100/80 transition-colors flex items-center gap-1.5 rounded-lg border border-slate-200/80"
      title={locale === "en" ? "Chuyển sang Tiếng Việt" : "Switch to English"}
    >
      <Globe className="w-3.5 h-3.5 text-indigo-600" />
      <span>{locale === "en" ? "🇬🇧 EN" : "🇻🇳 VI"}</span>
    </Button>
  );
}
