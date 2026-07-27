"use client";

import { useLocaleContext } from "./I18nProvider";
import { Button } from "@/components/ui/button";

function VietnamFlag() {
  return (
    <svg className="w-4 h-3 rounded-xs shrink-0 shadow-2xs overflow-hidden" viewBox="0 0 30 20" fill="none">
      <rect width="30" height="20" fill="#DA251D" />
      <polygon
        fill="#FFFF00"
        points="15,4 16.9,9.8 23,9.8 18.1,13.4 20,19.2 15,15.6 10,19.2 11.9,13.4 7,9.8 13.1,9.8"
      />
    </svg>
  );
}

function UKFlag() {
  return (
    <svg className="w-4 h-3 rounded-xs shrink-0 shadow-2xs overflow-hidden" viewBox="0 0 60 30" fill="none">
      <clipPath id="uk-clip">
        <rect width="60" height="30" />
      </clipPath>
      <g clipPath="url(#uk-clip)">
        <rect width="60" height="30" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#ffffff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2" />
        <path d="M30,0 V30 M0,15 H60" stroke="#ffffff" strokeWidth="10" />
        <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}

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
      className="h-8 px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100/80 transition-colors flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white"
      title={locale === "en" ? "Chuyển sang Tiếng Việt" : "Switch to English"}
    >
      {locale === "en" ? <UKFlag /> : <VietnamFlag />}
      <span className="font-bold text-slate-800">{locale === "en" ? "EN" : "VI"}</span>
    </Button>
  );
}
