import { useI18nStore } from "@/src/features/i18n/i18n.store";
import { Namespace } from "i18next";
import { useTranslation } from "react-i18next";

/** Use in components that need language switching */
export const useLanguage = () => {
  const { language, isRTL, setLanguage } = useI18nStore();
  return { language, isRTL, setLanguage };
};

/**
 * Namespace-scoped translation hook.
 * Use this in screens instead of raw useTranslation.
 *
 * @example
 * const t = useT('bookings');
 * t('tabs.upcoming') // → "Upcoming"
 */
export const useT = (ns: Namespace) => {
  const { t } = useTranslation(ns);
  return t;
};
