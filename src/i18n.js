import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // lng: "en", // <- force English as initial language
    fallbackLng: "en",
    supportedLngs: ["tr", "en"],
    detection: {
      order: [
        // check these sources _in order_
        "localStorage",
        "navigator",
        "htmlTag",
        "path",
        "querystring",
      ],
      caches: ["localStorage"], // write the “used” language back to localStorage
      lookupLocalStorage: "i18nextLng",
    },

    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },

    interpolation: { escapeValue: false },
  });

export default i18n;
