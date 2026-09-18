import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import {
  Alert,
  BackHandler,
  Dimensions,
  Linking,
  Platform,
} from "react-native";

export function runHaptics() {
  // iOS has excellent haptics
  if (Platform.OS === "ios") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    return;
  }

  // Android haptics vary; selectionAsync is reliable
  if (Platform.OS === "android") {
    Haptics.selectionAsync();
    return;
  }

  // If it's something exotic (web, desktop, emulator), fail quietly
  try {
    Haptics.selectionAsync();
  } catch (_) {}
}

export function runWithHaptics(callback?: () => void) {
  runHaptics();
  callback?.();
}

export const callNumber = async (phoneNumber: string) => {
  const cleanNumber = phoneNumber.replace(/[^0-9+]/g, "");
  if (!cleanNumber) {
    Alert.alert("Invalid Number", "The phone number is not valid.");
    return;
  }

  const url = `tel:${cleanNumber}`;

  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      await Clipboard.setStringAsync(cleanNumber); // ✅ Expo-safe
      Alert.alert(
        "Cannot Make Call",
        `Phone calls are not supported on this device. Number copied to clipboard: ${cleanNumber}`,
      );
    }
  } catch (error) {
    Alert.alert(
      "Error",
      `An unexpected error occurred while trying to call ${cleanNumber}`,
    );
    console.error("callNumber error:", error);
  }
};

export const copyData = async (text: string) => {
  await Clipboard.setStringAsync(text);
  return;
};

export const sendEmail = async (email: string) => {
  let emailUrl = `mailto:${email}`;
  const supported = await Linking.canOpenURL(emailUrl);
  if (supported) {
    await Linking.openURL(emailUrl);
  } else {
    Alert.alert("Error", "Unable to send email.");
  }
};

export const openInBrowser = async (imageUrl: string) => {
  const supported = await Linking.canOpenURL(imageUrl);
  if (supported) {
    await Linking.openURL(imageUrl);
  } else {
    Alert.alert("Error", `Can't open this URL: ${imageUrl}`);
  }
};

export const capitalizeWords = (str: string = "", lower = false) => {
  return (lower ? str.toLowerCase() : str).replace(
    /(?:^|\s|["'([{])+\S/g,
    (match) => match.toUpperCase(),
  );
};

export const camelCaseWords = (inputString: string) => {
  return inputString
    ?.toLowerCase()
    ?.replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
};

export const titleCaseWords = (inputString: string) => {
  return inputString
    ?.replace(/_/g, " ")
    ?.replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export const currencyFormatter = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value);
};

export const getAsyncStorageData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value != null ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Error retrieving data:", error);
  }
};
export const setAsyncStorageData = async (key: string, val: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(val));
  } catch (error) {
    console.error("Error retrieving data:", error);
  }
};

export const alpha = (color: string, opacity: number) => {
  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const dimensions = Dimensions.get("screen");

export const isObject = (item: any) => item && typeof item === "object";

export const states = [
  "ANDAMAN & NICOBAR ISLANDS",
  "ANDHRA PRADESH",
  "ARUNACHAL PRADESH",
  "ASSAM",
  "BIHAR",
  "CHANDIGARH",
  "CHHATTISGARH",
  "DADRA & NAGAR HAVELI & DAMAN & DIU",
  "DELHI",
  "GOA",
  "GUJARAT",
  "HARYANA",
  "HIMACHAL PRADESH",
  "JAMMU & KASHMIR",
  "JHARKHAND",
  "KARNATAKA",
  "KERALA",
  "LADAKH",
  "LAKSHADWEEP",
  "MADHYA PRADESH",
  "MAHARASHTRA",
  "MANIPUR",
  "MEGHALAYA",
  "MIZORAM",
  "NAGALAND",
  "ODISHA",
  "PUDUCHERRY",
  "PUNJAB",
  "RAJASTHAN",
  "SIKKIM",
  "TAMIL NADU",
  "TELANGANA",
  "TRIPURA",
  "UTTAR PRADESH",
  "UTTARAKHAND",
  "WEST BENGAL",
];

export const promptToExit = () => {
  const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
    Alert.alert(
      "Exit App",
      "Are you sure you want to exit?",
      [
        { text: "Cancel", style: "cancel", onPress: () => {} },
        {
          text: "Exit",
          style: "destructive",
          onPress: () => BackHandler.exitApp(),
        },
      ],
      { cancelable: true },
    );
    return true;
  });
  return () => backHandler.remove();
};

export function hexToColor(hex: string): string | null {
  // Remove whitespace and make lowercase
  hex = hex.trim().toLowerCase();
  // Expand shorthand form (#abc) to full form (#aabbcc)
  if (/^#([a-f0-9]{3})$/.test(hex)) {
    hex = "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }
  // Validate hex format
  if (/^#([a-f0-9]{6})$/.test(hex)) {
    return hex;
  }
  return null;
}

export const dataURLtoFile = (dataurl: string, filename: string) => {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export const getAllDatesUpToToday = (
  month: string,
  tillToday?: boolean,
): string[] => {
  const startOfMonth = dayjs(month, "YYYY-MM-DD").startOf("month");
  const endOfMonth = dayjs(month, "YYYY-MM-DD").endOf("month");
  const today = dayjs();
  const endDay = tillToday
    ? today.isBefore(endOfMonth)
      ? today
      : endOfMonth
    : endOfMonth;
  let dates: string[] = [];
  let currentDay = startOfMonth;
  while (currentDay.isSame(endDay) || currentDay.isBefore(endDay)) {
    dates.push(currentDay.format("DD-MM-YYYY"));
    currentDay.add(1, "day");
  }
  return dates;
};

export const chunk = (arr: any, size: number) =>
  arr.reduce(
    (acc: any, _: any, i: number) =>
      i % size ? acc : [...acc, arr.slice(i, i + size)],
    [],
  );

export const uriToFile = (uri: string, name: string) => {
  const ext = uri.split(".").pop() || "jpg";
  const mime = ext === "png" ? "image/png" : "image/jpeg";
  return {
    uri,
    name: `${name}.${ext}`,
    type: mime,
  } as any;
};

export const PHONE_REGEX = /^[6789]\d{9}$/;
export const sanitizePhone = (raw: string): string => {
  let val = raw.trim().replace(/[\s-]/g, ""); // strip spaces/dashes too
  if (val.startsWith("+91")) val = val.slice(3);
  val = val.replace(/^0+/, "");
  return val.replace(/\D/g, "").slice(0, 10); // strip any non-digits, then cap
};

export function decodeHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/\s+/g, " ")
    .trim();
}
