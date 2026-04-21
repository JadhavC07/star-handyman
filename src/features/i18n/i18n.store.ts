import i18n, { I18N_LANGUAGE_KEY } from "@/src/lib/i18n";
import { storage } from "@/src/lib/mmkv";
import * as Updates from "expo-updates";
import { I18nManager } from "react-native";
import { create } from "zustand";
import { I18nState, SupportedLanguage } from "./i18n.types";

// Only Arabic is RTL in your target markets (en, fr, es, pt are all LTR)
const RTL_LANGUAGES: SupportedLanguage[] = [];

export const useI18nStore = create<I18nState>(() => ({
  language: i18n.language as SupportedLanguage,
  isRTL: I18nManager.isRTL,

  setLanguage: async (lang: SupportedLanguage) => {
    storage.set(I18N_LANGUAGE_KEY, lang);
    await i18n.changeLanguage(lang);

    const willBeRTL = RTL_LANGUAGES.includes(lang);

    if (willBeRTL !== I18nManager.isRTL) {
      I18nManager.allowRTL(willBeRTL);
      I18nManager.forceRTL(willBeRTL);
      await Updates.reloadAsync();
      return;
    }

    useI18nStore.setState({ language: lang, isRTL: willBeRTL });
  },
}));
