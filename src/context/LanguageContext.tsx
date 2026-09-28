"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  translations,
  type SupportedLanguage,
  type TranslationKey,
} from "@/src/lib/translations";

const STORAGE_KEY = "guardian-language";

function isSupportedLanguage(value: string | null): value is SupportedLanguage {
  return !!value && value in translations;
}

type LanguageContextValue = {
  language: SupportedLanguage;
  setLanguage: (value: SupportedLanguage | string) => void;
  t: (key: TranslationKey, fallback?: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>("en");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedLanguage = window.localStorage.getItem(STORAGE_KEY);

    if (isSupportedLanguage(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (value: SupportedLanguage | string) => {
    const normalized = isSupportedLanguage(value) ? value : "en";

    setLanguageState(normalized);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, normalized);
    }
  };

  const t = (key: TranslationKey, fallback?: string) => {
    const currentTranslations = translations[language] ?? translations.en;
    const value = currentTranslations[key] ?? translations.en[key] ?? fallback ?? key;

    return value;
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside a LanguageProvider");
  }

  return context;
}
