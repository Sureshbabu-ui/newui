import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import Entranslation from "../public/locales/en/translation.json"
import Tatranslation from "../public/locales/ta/translation.json"
i18n
    .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    lng:"en",
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, 
      // not needed for react as it escapes by default
    },
    react: {
      useSuspense: false
  },
  resources: {
    "en": {
      translation:Entranslation
    },
    'ta':{
        translation:Tatranslation
    },
}
  });

export default i18n;