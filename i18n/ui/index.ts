import type { Locale } from "@/i18n/config";
import en from "./en";
import ja from "./ja";
import ko, { type Dict } from "./ko";
import zh from "./zh";

export type { Dict };
export const DICTS: Record<Locale, Dict> = { ko, en, ja, zh };
export const getDict = (lang: Locale): Dict => DICTS[lang];
