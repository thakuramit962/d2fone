import { useEffect } from "react";

import { selectedLanguage } from "@/models/language";
import { updateAppState } from "@/slices/appSlice";
import { updateProcessingState } from "@/slices/processing-state-slice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

export default function useLanguage() {
  const languageOptions = [
    { id: 1, label: "English", value: "en", symbol: "En" },
    { id: 2, label: "हिंदी", value: "hi", symbol: "ह" },
    { id: 3, label: "ਪੰਜਾਬੀ", value: "pa", symbol: "ਪੰ" },
    { id: 4, label: "ગુજરાતી", value: "gu", symbol: "ગુ" },
    { id: 5, label: "मराठी", value: "mr", symbol: "म" },
    { id: 6, label: "తెలుగు", value: "te", symbol: "తె" },
    { id: 7, label: "தமிழ்", value: "ta", symbol: "த" },
  ];

  const { i18n } = useTranslation();
  const dispatch = useDispatch();

  const changeLanguage = async (option: {
    id: number;
    label: string;
    value: string;
  }) => {
    dispatch(updateProcessingState(true));
    try {
      dispatch(updateAppState({ language: option.value as selectedLanguage }));
      await i18n.changeLanguage(option.value);
      await AsyncStorage.setItem(
        "user-language",
        option.value as selectedLanguage,
      );
    } catch (error) {
      console.error("Error changing language:", error);
    } finally {
      setTimeout(() => {
        dispatch(updateProcessingState(false));
      }, 1000);
    }
  };

  useEffect(() => {
    dispatch(
      updateAppState({ language: (i18n.language || "en") as selectedLanguage }),
    );
  }, [i18n.language, dispatch]);

  return {
    languageOptions,
    changeLanguage,
  };
}
