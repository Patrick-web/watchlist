import { ColorOptions } from "@/constants/colors.constants";
import { useTheme } from "@/hooks/useTheme.hook";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { ReactNode } from "react";
import {
  FlexStyle,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import Animated, { AnimatedStyle } from "react-native-reanimated";
import { AnimateProps } from "react-native-reanimated/lib/typescript/Animated";

export default function Box({
  viewProps,
  style,
  absoluteFill,
  children,
  ...styleProps
}: BoxProps) {
  const theme = useTheme();

  const boxColor = () => {
    if (styleProps.color) {
      if (theme[styleProps.color as keyof ColorOptions]) {
        return theme[styleProps.color as keyof ColorOptions];
      }
      return styleProps.color;
    }
    return null;
  };

  const combinedStyles = [
    generateStylesObject({ ...styleProps, color: boxColor() }),
    absoluteFill ? StyleSheet.absoluteFill : null,
    style,
  ];

  return (
    <View style={combinedStyles} {...viewProps}>
      {children}
    </View>
  );
}

export function BottomSheetBox({
  viewProps,
  style,
  absoluteFill,
  children,
  ...styleProps
}: BoxProps) {
  const combinedStyles = [
    generateStylesObject(styleProps),
    absoluteFill ? StyleSheet.absoluteFill : null, // Add absolute fill if true
    style,
  ];
  return (
    <BottomSheetView style={combinedStyles} {...viewProps}>
      {children}
    </BottomSheetView>
  );
}

export function AnimatedBox({
  viewProps,
  absoluteFill,
  style,
  children,
  ...styleProps
}: AnimatedBoxProps) {
  const combinedStyles = [
    generateStylesObject(styleProps),
    absoluteFill ? StyleSheet.absoluteFill : null, // Add absolute fill if true
    style,
  ];
  return (
    <Animated.View style={combinedStyles} {...viewProps}>
      {children}
    </Animated.View>
  );
}
function generateStylesObject(shortStyles: ShortStyles | any): ViewStyle {
  const styles: ViewStyle = {};
  const styleMappings: { [key: string]: keyof ViewStyle } = {
    direction: "flexDirection",
    wrap: "flexWrap",
    justify: "justifyContent",
    align: "alignItems",
    radius: "borderRadius",
    color: "backgroundColor",
    pa: "padding",
    px: "paddingHorizontal",
    py: "paddingVertical",
    pt: "paddingTop",
    pb: "paddingBottom",
    pl: "paddingLeft",
    pr: "paddingRight",
    ma: "margin",
    mx: "marginHorizontal",
    my: "marginVertical",
    mt: "marginTop",
    mb: "marginBottom",
    ml: "marginLeft",
    mr: "marginRight",
    opacity: "opacity",
  };

  for (const key in shortStyles) {
    const styleKey = styleMappings[key];

    if (styleKey) {
      styles[styleKey] = shortStyles[key];
    } else if (key === "block") {
      styles.width = "100%";
    }
    // handle radiusTop and radiusBottom
    else if (key === "radiusTop") {
      styles.borderTopLeftRadius = shortStyles[key];
      styles.borderTopRightRadius = shortStyles[key];
    } else if (key === "radiusBottom") {
      styles.borderBottomLeftRadius = shortStyles[key];
      styles.borderBottomRightRadius = shortStyles[key];
    } else {
      // @ts-ignore
      styles[key] = shortStyles[key];
    }
  }

  return styles;
}

export interface BoxProps extends ShortStyles {
  children?: ReactNode;
  block?: boolean;
  style?: ViewStyle;
  absoluteFill?: boolean;
}

interface ShortStyles extends Omit<ViewStyle, "direction"> {
  direction?: ViewStyle["flexDirection"];
  colGap?: FlexStyle["gap"];
  rowGap?: FlexStyle["gap"];
  align?: FlexStyle["alignItems"];
  justify?: FlexStyle["justifyContent"];
  px?: ViewStyle["paddingHorizontal"];
  py?: ViewStyle["paddingVertical"];
  pa?: ViewStyle["padding"];
  mx?: ViewStyle["marginHorizontal"];
  my?: ViewStyle["marginVertical"];
  ma?: ViewStyle["margin"];
  pt?: ViewStyle["paddingTop"];
  pb?: ViewStyle["paddingBottom"];
  pl?: ViewStyle["paddingLeft"];
  pr?: ViewStyle["paddingRight"];
  mt?: ViewStyle["marginTop"];
  mb?: ViewStyle["marginBottom"];
  ml?: ViewStyle["marginLeft"];
  mr?: ViewStyle["marginRight"];
  color?: ViewStyle["backgroundColor"];
  radius?: ViewStyle["borderRadius"];
  wrap?: FlexStyle["flexWrap"];
  radiusTop?: ViewStyle["borderRadius"];
  radiusBottom?: ViewStyle["borderRadius"];
  viewProps?: Omit<ViewProps, "style">;
}

export interface AnimatedBoxProps
  extends Omit<BoxProps, "style" | "viewProps"> {
  style?: AnimatedStyle;
  viewProps?: AnimateProps<ViewProps>;
}
