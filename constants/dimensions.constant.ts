import { Dimensions, Platform } from "react-native";

export const { width: sWidth, height: sHeight } = Dimensions.get("window");

export const POSTER_RATIO = 1.5;

// function to dela with density  differences on ios and android
export const normalize = (value: number) => {
  if (Platform.OS === "ios") {
    return value;
  }
  return value * 0.95;
};
