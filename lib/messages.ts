import type { Locale, Messages } from "./types";

import ar from "@/messages/ar.json";
import en from "@/messages/en.json";

const byLocale: Record<Locale, Messages> = {
  en: en as Messages,
  ar: ar as Messages,
};

export function getMessages(locale: Locale): Messages {
  return byLocale[locale] ?? byLocale.en;
}
