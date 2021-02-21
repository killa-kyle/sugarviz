import { StyleSheet } from "react-native"

export default {
  primary: "rgba(255,229,0,1)",
  secondary: "#8F0CE8",
  gray0: "#393e42",
  gray1: "#43484d",
  gray2: "#5e6977",
  gray3: "#86939e",
  gray4: "#bdc6cf",
  gray5: "#e1e8ee",
  grayOutline: "#bbb",
  searchBg: "#303337",
  success: "#52c41a",
  error: "#ff190c",
  warning: "#faad14",
  disabled: "hsl(208, 8%, 90%)",
  // Darker color if hairlineWidth is not thin enough
  divider: StyleSheet.hairlineWidth < 1 ? "#bcbbc1" : "rgba(0, 0, 0, 0.12)",
  platform: {
    ios: {
      primary: "#007aff",
      secondary: "#5856d6",
      success: "#4cd964",
      error: "#ff3b30",
      warning: "#ffcc00",
    },
    android: {
      primary: "#2196f3",
      secondary: "#9C27B0",
      success: "#4caf50",
      error: "#f44336",
      warning: "#ffeb3b",
    },
  },
}
