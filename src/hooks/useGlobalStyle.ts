import { dimensions } from "@/utils/app-helper";
import { StyleSheet } from "react-native";
import { useTheme } from "./use-theme";

export function useGlobalStyle() {
  const theme = useTheme();

  const globalStyle = StyleSheet.create({
    flexCenter: {
      alignItems: "center",
      justifyContent: "center",
    },
    slateBox: {
      backgroundColor: theme?.background.slate,
      padding: 16,
      borderRadius: 36,
      margin: 8,
    },
    fullHeight: {
      flex: 1,
      paddingBottom: 100,
      minHeight: dimensions.height,
    },
    flex1: {
      flex: 1,
    },
    row: {
      flexDirection: "row",
    },
    rowCenter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    rowStartCenter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    rowEndCenter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    rowTopCenter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    rowCenterBottom: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "center",
    },

    rowStartTop: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "flex-start",
    },

    rowEndTop: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "flex-end",
    },

    rowStartBottom: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "flex-start",
    },
    rowEndBottom: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "flex-end",
    },
    rowBetweenCenter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    rowBetweenTop: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
    },
    rowBetweenBottom: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
    },

    alignEnd: {
      alignItems: "flex-end",
    },
    alignStart: {
      alignItems: "flex-start",
    },
    alignCenter: {
      alignItems: "center",
    },
    justifyEnd: {
      justifyContent: "flex-end",
    },
    justifyStart: {
      justifyContent: "flex-start",
    },
    justifyCenter: {
      justifyContent: "center",
    },
    justifyBetween: {
      justifyContent: "space-between",
    },
    justifyAround: {
      justifyContent: "space-around",
    },
    justifyEven: {
      justifyContent: "space-evenly",
    },
    pageLeftPadding: {
      paddingLeft:
        dimensions.width * 0.025 > 24 ? 24 : dimensions.width * 0.025,
    },
    pageRightPadding: {
      paddingRight:
        dimensions.width * 0.025 > 24 ? 24 : dimensions.width * 0.025,
    },
  });

  return globalStyle;
}
