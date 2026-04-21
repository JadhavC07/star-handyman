import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import { storage } from './mmkv';

import enCommon from '../features/i18n/locales/en/common.json';
import enAuth from '../features/i18n/locales/en/auth.json';
import enHandymanAuth from '../features/i18n/locales/en/handyman-auth.json';
import enProfile from '../features/i18n/locales/en/profile.json';
import enHandyman from '../features/i18n/locales/en/handyman.json';

import esCommon from '../features/i18n/locales/es/common.json';
import esAuth from '../features/i18n/locales/es/auth.json';
import esHandymanAuth from '../features/i18n/locales/es/handyman-auth.json';
import esProfile from '../features/i18n/locales/es/profile.json';
import esHandyman from '../features/i18n/locales/es/handyman.json';

export const I18N_LANGUAGE_KEY = 'app_language';

export const SUPPORTED_LANGUAGES = ['en','es',] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const NAMESPACES = [
  'common',
  'auth',
  'handyman-auth',
  'profile',
  'handyman',
] as const;

export type Namespace = (typeof NAMESPACES)[number];

const getInitialLanguage = (): SupportedLanguage => {
  const saved = storage.getString(I18N_LANGUAGE_KEY) as SupportedLanguage;
  if (saved && SUPPORTED_LANGUAGES.includes(saved)) return saved;

  const device = getLocales()[0]?.languageCode as SupportedLanguage;
  return SUPPORTED_LANGUAGES.includes(device) ? device : 'en';
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  ns: NAMESPACES,
  defaultNS: 'common',
  resources: {
    en: {
      common: enCommon,
      auth: enAuth,
      'handyman-auth': enHandymanAuth,
      profile: enProfile,
      handyman: enHandyman,
    },
    es: {
      common: esCommon,
      auth: esAuth,
      'handyman-auth': esHandymanAuth,
      profile: esProfile,
      handyman: esHandyman,
    },
  },
  interpolation: { escapeValue: false },
});

export default i18n;
