import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import { storage } from './mmkv';

import enCommon from '../features/i18n/locales/en/common.json';
import enAuth from '../features/i18n/locales/en/auth.json';
import enHandymanAuth from '../features/i18n/locales/en/handyman-auth.json';
import enHome from '../features/i18n/locales/en/home.json';
import enServices from '../features/i18n/locales/en/services.json';
import enBookings from '../features/i18n/locales/en/bookings.json';
import enChat from '../features/i18n/locales/en/chat.json';
import enTracking from '../features/i18n/locales/en/tracking.json';
import enSearch from '../features/i18n/locales/en/search.json';
import enProfessional from '../features/i18n/locales/en/professional.json';
import enProfile from '../features/i18n/locales/en/profile.json';
import enHandyman from '../features/i18n/locales/en/handyman.json';

import esCommon from '../features/i18n/locales/es/common.json';
import esAuth from '../features/i18n/locales/es/auth.json';
import esHandymanAuth from '../features/i18n/locales/es/handyman-auth.json';
import esHome from '../features/i18n/locales/es/home.json';
import esServices from '../features/i18n/locales/es/services.json';
import esBookings from '../features/i18n/locales/es/bookings.json';
import esChat from '../features/i18n/locales/es/chat.json';
import esTracking from '../features/i18n/locales/es/tracking.json';
import esSearch from '../features/i18n/locales/es/search.json';
import esProfessional from '../features/i18n/locales/es/professional.json';
import esProfile from '../features/i18n/locales/es/profile.json';
import esHandyman from '../features/i18n/locales/es/handyman.json';

export const I18N_LANGUAGE_KEY = 'app_language';

export const SUPPORTED_LANGUAGES = ['en','es',] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const NAMESPACES = [
  'common',
  'auth',
  'handyman-auth',
  'home',
  'services',
  'bookings',
  'chat',
  'tracking',
  'search',
  'professional',
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
      home: enHome,
      services: enServices,
      bookings: enBookings,
      chat: enChat,
      tracking: enTracking,
      search: enSearch,
      professional: enProfessional,
      profile: enProfile,
      handyman: enHandyman,
    },
    es: {
      common: esCommon,
      auth: esAuth,
      'handyman-auth': esHandymanAuth,
      home: esHome,
      services: esServices,
      bookings: esBookings,
      chat: esChat,
      tracking: esTracking,
      search: esSearch,
      professional: esProfessional,
      profile: esProfile,
      handyman: esHandyman,
    },
  },
  interpolation: { escapeValue: false },
});

export default i18n;
