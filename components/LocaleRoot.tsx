"use client";

import { useEffect, type ReactNode } from "react";

import type { Locale } from "@/lib/types";

export function LocaleRoot({ locale, children }: { locale: Locale; children: ReactNode }) {
  useEffect(() => {
    const html = document.documentElement;
    if (locale === "ar") {
      html.setAttribute("lang", "ar");
      html.setAttribute("dir", "rtl");
    } else {
      html.setAttribute("lang", "en");
      html.setAttribute("dir", "ltr");
    }
  }, [locale]);

  return children;
}
