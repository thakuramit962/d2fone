export const mainTheme = {
  success: "#17c964",
  info: "#006FEE",
  warning: "#f5a524",
  error: "#f31260",
};

export const lightTheme = {
  ...mainTheme,
  primary: "#255F38",
  secondary: "#fbb810",

  primaryContrast: "#ffffff",
  secondaryContrast: "#2d2d2d",

  text: {
    primary: "#100C08",
    secondary: "#696969",
    disabled: "#a5a5a5",
  },

  background: {
    main: "#ffffff",
    slate: "#f7f7f7",
  },

  brand_green: "#497404",
  brand_dark: "#233703",
  brand_cream: "#fff0ac",
};

export const darkTheme = {
  ...mainTheme,
  info: "#80C4E9",
  success: "#77B254",
  error: "#EE4266",

  primary: "#88C273",
  secondary: "#F3C623",

  primaryContrast: "#2d2d2d",
  secondaryContrast: "#2d2d2d",

  text: {
    primary: "#ffffff",
    secondary: "#D1D0CE",
    disabled: "#666A6D",
  },

  background: {
    main: "#181D18",
    slate: "#131313",
  },

  brand_green: "#497404",
  brand_dark: "#233703",
  brand_cream: "#fff0ac",
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const;

export type ThemeType = keyof typeof themes;
export type ThemeInterface = typeof lightTheme;
