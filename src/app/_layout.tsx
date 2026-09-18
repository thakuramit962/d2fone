import LoadingScreen from "@/components/basic/containers/loadingScreen";
import ThemeLoading from "@/components/basic/ThemeLoading";
import ThemeToast from "@/components/basic/ThemeToast";
import API from "@/constants/api";
import { useToast } from "@/hooks/useToast";
import { useUser } from "@/hooks/useUser";
import { RootState } from "@/store/store";
import '@/utils/i18n';
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {
  memo,
  useCallback,
  useEffect,
  useState
} from "react";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "../store/store";


// ─── Fonts ────────────────────────────────────────────────────────────────────

const FONTS = {
  MontserratBlack: require("../../assets/fonts/montserrat/Montserrat-Black.ttf"),
  MontserratBlackItalic: require("../../assets/fonts/montserrat/Montserrat-BlackItalic.ttf"),
  MontserratBold: require("../../assets/fonts/montserrat/Montserrat-Bold.ttf"),
  MontserratBoldItalic: require("../../assets/fonts/montserrat/Montserrat-BoldItalic.ttf"),
  MontserratExtraBold: require("../../assets/fonts/montserrat/Montserrat-ExtraBold.ttf"),
  MontserratExtraBoldItalic: require("../../assets/fonts/montserrat/Montserrat-ExtraBoldItalic.ttf"),
  MontserratExtraLight: require("../../assets/fonts/montserrat/Montserrat-ExtraLight.ttf"),
  MontserratExtraLightItalic: require("../../assets/fonts/montserrat/Montserrat-ExtraLightItalic.ttf"),
  MontserratItalic: require("../../assets/fonts/montserrat/Montserrat-Italic.ttf"),
  MontserratLight: require("../../assets/fonts/montserrat/Montserrat-Light.ttf"),
  MontserratLightItalic: require("../../assets/fonts/montserrat/Montserrat-LightItalic.ttf"),
  MontserratMedium: require("../../assets/fonts/montserrat/Montserrat-Medium.ttf"),
  MontserratMediumItalic: require("../../assets/fonts/montserrat/Montserrat-MediumItalic.ttf"),
  MontserratRegular: require("../../assets/fonts/montserrat/Montserrat-Regular.ttf"),
  MontserratSemiBold: require("../../assets/fonts/montserrat/Montserrat-SemiBold.ttf"),
  MontserratSemiBoldItalic: require("../../assets/fonts/montserrat/Montserrat-SemiBoldItalic.ttf"),
  MontserratThin: require("../../assets/fonts/montserrat/Montserrat-Thin.ttf"),
  MontserratThinItalic: require("../../assets/fonts/montserrat/Montserrat-ThinItalic.ttf"),
  InterBold: require("../../assets/fonts/inter/Inter-Bold.ttf"),
  InterBoldItalic: require("../../assets/fonts/inter/Inter-BoldItalic.ttf"),
  InterExtraBold: require("../../assets/fonts/inter/Inter-ExtraBold.ttf"),
  InterExtraBoldItalic: require("../../assets/fonts/inter/Inter-ExtraBoldItalic.ttf"),
  InterItalic: require("../../assets/fonts/inter/Inter-RegularItalic.ttf"),
  InterMedium: require("../../assets/fonts/inter/Inter-Medium.ttf"),
  InterMediumItalic: require("../../assets/fonts/inter/Inter-MediumItalic.ttf"),
  InterRegular: require("../../assets/fonts/inter/Inter-Regular.ttf"),
  InterSemiBold: require("../../assets/fonts/inter/Inter-SemiBold.ttf"),
  InterSemiBoldItalic: require("../../assets/fonts/inter/Inter-SemiBoldItalic.ttf"),
};

SplashScreen.preventAutoHideAsync()


// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(FONTS);
  const [persistReady, setPersistReady] = useState(false);
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Or a loading component if you prefer
  }

  return (
    <Provider store={store}>
      <PersistGate
        loading={<LoadingScreen />}
        persistor={persistor}
      >
        <Main />
      </PersistGate>
    </Provider>
  );
}

const Main = memo(function Main() {
  const hasOnboarded = useSelector((state: RootState) => state?.appSlice?.hasOnboarded ?? false);
  const isLoggedIn = useSelector((state: RootState) => state?.auth?.isLoggedIn ?? false);
  const accessToken = useSelector((state: RootState) => state?.auth?.accessToken ?? null);

  const { showToast } = useToast();
  const { logout } = useUser();

  const handleNetworkError = useCallback(
    (error: unknown) => {
      if (axios.isCancel(error)) return Promise.reject(error);

      const message = error instanceof Error ? error.message : "Unknown error";

      if (message === "Network Error") {
        showToast("Network Error", "No internet connection.", "error");
      } else if (message.includes("net::ERR_NETWORK_CHANGED")) {
        showToast("Network Error", "Connection changed. Please retry.", "error");
      } else {
        showToast("Error", "Something went wrong on our end.", "error");
      }

      return Promise.reject(error);
    },
    [showToast],
  );

  useEffect(() => {
    API.defaults.headers.common["Content-Type"] = "application/json";

    const apiKey = process.env.EXPO_PUBLIC_API_KEY;
    if (apiKey) {
      API.defaults.headers.common["x-api-key"] = btoa(apiKey);
    } else if (__DEV__) {
      console.warn(
        "EXPO_PUBLIC_API_KEY is not set — API requests requiring x-api-key will fail.",
      );
    }

    API.defaults.headers.common["crossorigin"] = "anonymous";
    API.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

    if (accessToken) {
      API.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    } else {
      delete API.defaults.headers.common["Authorization"];
    }

    const interceptorId = API.interceptors.response.use(
      (response) => {
        if (response.data?.statuscode === 401) logout();
        return response;
      },
      handleNetworkError,
    );

    return () => {
      API.interceptors.response.eject(interceptorId);
    };
  }, [accessToken, logout, handleNetworkError]);

  // usePushNotifications({
  //   onNotificationTap: (data: any) => {
  //     if (data?.route) {
  //       router.push({
  //         pathname: data.route || '/tabs/home',
  //         params: data?.params ? JSON.parse(data.params) : {},
  //       });
  //     }
  //   },
  // });

  dayjs.extend(relativeTime)

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade_from_bottom",
        }}
        initialRouteName="index"
      >
        <Stack.Protected guard={!hasOnboarded}>
          <Stack.Screen name="landing" />
        </Stack.Protected>

        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="tabs" />
        <Stack.Screen name="(protected)" />
        <Stack.Screen name="comingSoon" />

        <Stack.Screen name="weather" />
        <Stack.Screen name="latestNews" />
        <Stack.Screen name="appPermissions" />
        <Stack.Screen name="myLocation" />
        <Stack.Screen name="agricoinsPolicy" />
        <Stack.Screen name="rewards" />

        <Stack.Screen name="policies" />
        <Stack.Screen name="feedbacks" />
        <Stack.Screen name="support" />
        <Stack.Screen name="aboutUs" />

        <Stack.Screen name="+not-found" />
        <Stack.Screen name="checkUpdate" />
        <Stack.Screen name="chooseLanguage" />
        <Stack.Screen name="logsScreen" />
      </Stack>

      <ThemeLoading />
      <ThemeToast />

    </>
  );
});