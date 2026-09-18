import { dimensions } from "../utils/app-helper";

const windowWidth = dimensions.width;
export const SHEET_ZINDEX = 999999999;

// export const size = {
//   sizeLarge: windowWidth * 0.06 > 22 ? 22 : windowWidth * 0.06,
//   sizeMedium: windowWidth * 0.0475 > 18 ? 18 : windowWidth * 0.0475,
//   sizeRegular: windowWidth * 0.04 > 16 ? 16 : windowWidth * 0.04,
//   sizeSmall: windowWidth * 0.03 > 14 ? 14 : windowWidth * 0.03,
//   sizeExtraSmall: windowWidth * 0.025 > 12 ? 12 : windowWidth * 0.025,
// };

const scale = (ratio: number, cap: number) =>
  Math.min(windowWidth * ratio, cap);

export const size = {
  sizeLarge: scale(0.06, 21),
  sizeMedium: scale(0.0475, 17),
  sizeRegular: scale(0.04, 15),
  sizeSmall: scale(0.03, 14),
  sizeExtraSmall: scale(0.025, 12),
};

export const getFontSize = (
  variant: "lg" | "md" | "sm" | "xs" | "xxs" | undefined,
) => {
  const sizeMap = {
    lg: size.sizeLarge,
    md: size.sizeMedium,
    sm: size.sizeRegular,
    xs: size.sizeSmall,
    xxs: size.sizeExtraSmall,
  };

  return variant != undefined ? sizeMap[variant] : 10;
};

export const APP_VERSION = "2.0.0";
export const IS_LIVE = false;

export const SERVER_URL = IS_LIVE
  ? "https://api.d2f.co.in"
  : "https://development-api.d2f.co.in";
export const s3BucketUrl = IS_LIVE
  ? "https://agriwing.s3.ap-south-1.amazonaws.com"
  : "https://trainingbeta.s3.ap-south-1.amazonaws.com";

// export const SERVER_URL = "https://development-api.d2f.co.in";
// export const s3BucketUrl = "https://trainingbeta.s3.ap-south-1.amazonaws.com";

export const API_URL = `${SERVER_URL}/api`;
export const WEATHER_API_KEY = "a2965707c0ab4623824105752252502";
export const MANDIBHAAV_API_KEY =
  "579b464db66ec23bdd00000109b496cdbe7a4c555d40246b0a806e37";

export const WEATHER_API_URL = "https://api.weatherapi.com/v1";

export const BRAND_GREEN = "#497404";
export const BRAND_DARK = "#233703";
export const BRAND_CREAM = "#fff0ac";
