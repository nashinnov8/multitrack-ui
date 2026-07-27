"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import Cookies from "js-cookie";
import enMessages from "@/messages/en.json";
import viMessages from "@/messages/vi.json";

type Locale = "en" | "vi";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  setLocale: () => {},
});

export const useLocaleContext = () => useContext(I18nContext);

const messagesMap = {
  en: enMessages,
  vi: viMessages,
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLocale = Cookies.get("NEXT_LOCALE") as Locale;
    if (savedLocale === "en" || savedLocale === "vi") {
      setLocaleState(savedLocale);
    }
    setMounted(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    Cookies.set("NEXT_LOCALE", newLocale, { expires: 365 });
  };

  const messages = messagesMap[locale] || enMessages;

  return (
    <I18nContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider
        locale={locale}
        messages={messages}
        timeZone="Asia/Ho_Chi_Minh"
      >
        {children}
      </NextIntlClientProvider>
    </I18nContext.Provider>
  );
}
