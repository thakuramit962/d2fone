import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useSegments } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { featureList } from "./featureList";

export interface PopupFeature {
  id: string;
  title: string;
  tagline: string;
  route: string; // e.g., "/yield-predictor" or "/services/spray"
  frequency: "once" | "always";
}

const STORAGE_KEY_PREFIX = "@dismissed_popup_";
const DWELL_TIME_MS = 6000; // 6 seconds of screen dwell time

export const useFeatureNudge = ({
  dwellTime = DWELL_TIME_MS,
}: {
  dwellTime?: number;
}) => {
  const segments = useSegments(); // Tracks route changes to safely reset timers
  const [activePopup, setActivePopup] = useState<PopupFeature | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startTimer();

    return () => clearTimer();
  }, [segments]);

  const startTimer = () => {
    clearTimer();
    timerRef.current = setTimeout(async () => {
      await selectAndShowRandomPopup();
    }, dwellTime);
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const selectAndShowRandomPopup = async () => {
    try {
      const availablePopups: PopupFeature[] = [];

      for (const item of featureList as PopupFeature[]) {
        const isDismissedPermanently = await AsyncStorage.getItem(
          `${STORAGE_KEY_PREFIX}${item.id}`,
        );
        if (!isDismissedPermanently) {
          availablePopups.push(item);
        }
      }

      if (availablePopups.length > 0) {
        const randomIndex = Math.floor(Math.random() * availablePopups.length);
        setActivePopup(availablePopups[randomIndex]);
      }
    } catch (error) {
      console.error("Error filtering feature nudges:", error);
    }
  };

  const handleClose = async (dontShowAgain: boolean) => {
    if (activePopup && dontShowAgain) {
      try {
        await AsyncStorage.setItem(
          `${STORAGE_KEY_PREFIX}${activePopup.id}`,
          "true",
        );
      } catch (error) {
        console.error("Error saving nudge dismissal:", error);
      }
    }
    setActivePopup(null);
  };

  const handleAction = () => {
    if (activePopup) {
      const targetRoute = activePopup.route;
      setActivePopup(null);

      // Expo Router handles route strings directly (e.g., /home/yield-predictor)
      router.push(targetRoute as any);
    }
  };

  return {
    activePopup,
    handleClose,
    handleAction,
  };
};
