import { useColorScheme } from "react-native";
import { useSelector } from "react-redux";

import { ThemeInterface, themes, ThemeType } from "../constants/theme";
import { RootState } from "../store/store";

export function useTheme(): ThemeInterface {
  const systemTheme = useColorScheme();

  const selectedTheme = useSelector(
    (state: RootState) => state.colorMode?.mode || "system",
  );

  const activeTheme: ThemeType = "light";
  // const activeTheme: ThemeType =
  //   selectedTheme === "system"
  //     ? systemTheme === "dark"
  //       ? "dark"
  //       : "light"
  //     : selectedTheme;

  return themes[activeTheme];
}
