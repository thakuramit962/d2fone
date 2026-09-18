import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/locales/en";
import gu from "@/locales/gu";
import hi from "@/locales/hi";
import mr from "@/locales/mr";
import pa from "@/locales/pa";
import ta from "@/locales/ta";
import te from "@/locales/te";

const deviceLanguage = Localization.getLocales()[0]?.languageCode ?? "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    pa: { translation: pa },
    gu: { translation: gu },
    mr: { translation: mr },
    te: { translation: te },
    ta: { translation: ta },
  },
  lng: deviceLanguage, // start with device language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

AsyncStorage.getItem("user-language").then((savedLang) => {
  if (savedLang) {
    i18n.changeLanguage(savedLang);
  }
});

export default i18n;
