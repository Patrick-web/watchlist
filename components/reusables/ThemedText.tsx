import React, { ReactNode } from "react";
import { Text, TextProps, TextStyle } from "react-native";

import { ColorOptions } from "@/constants/colors.constants";
import { changeCase } from "@/utils/text.utils";
import { useTheme } from "../../hooks/useTheme.hook";

const ThemedText = ({
  textProps,
  style,
  children,
  size = "md",
  darkModeColor,
  fontFamily,
  fontWeight,
  color,
  case: textCase,
  ...styleProps
}: ThemedTextProps) => {
  const theme = useTheme();

  const textSize = () => {
    if (typeof size === "string") {
      const foundSize = textSizes.find((options) => options.size === size);
      if (!foundSize)
        return textSizes.find((options) => options.size === "md")!.value;
      return foundSize.value;
    } else {
      return size;
    }
  };

  const textColor = () => {
    if (color) {
      // check if color is included in the theme.colors and return its value if it is
      if (theme[color as keyof ColorOptions]) {
        return theme[color as keyof ColorOptions];
      }
      return color;
    }
    if (darkModeColor) {
      return darkModeColor;
    }
    return theme.text;
  };

  return (
    <Text
      style={[
        {
          color: textColor(),
          fontSize: textSize(),
          fontFamily: fontWeight
            ? mapFontweightToFontFamily(fontWeight)
            : fontFamily,
          ...generateStylesObject(styleProps),
        },
        style,
      ]}
      {...textProps}
    >
      {textCase ? changeCase(children as string, textCase) : children}
    </Text>
  );
};

export default ThemedText;

function mapFontweightToFontFamily(
  weight: FontWeight,
  fontPrefix = "SpaceGrotesk",
) {
  switch (weight) {
    case "extralight":
      return `${fontPrefix}ExtraLight`;
    case "light":
      return `${fontPrefix}Light`;
    case "regular":
      return `${fontPrefix}Regular`;
    case "normal":
      return `${fontPrefix}Regular`;
    case "medium":
      return `${fontPrefix}Medium`;
    case "semibold":
      return `${fontPrefix}SemiBold`;
    case "extrabold":
      return `${fontPrefix}ExtraBold`;
    case "bold":
      return `${fontPrefix}Bold`;
    case "black":
      return `${fontPrefix}Black`;
    default:
  }
}

function generateStylesObject(shortStyles: ShortStyles | any): TextStyle {
  const styles: TextStyle = {};
  const styleMappings: { [key: string]: keyof TextStyle } = {
    align: "textAlign",
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
  };

  for (const key in shortStyles) {
    const styleKey = styleMappings[key];

    if (styleKey) {
      styles[styleKey] = shortStyles[key];
    } else {
      // @ts-ignore
      styles[key] = shortStyles[key];
    }
  }

  return styles;
}

const textSizes = [
  { size: "xxxs", value: 8 },
  { size: "xxs", value: 10 },
  { size: "xs", value: 12 },
  { size: "sm", value: 14 },
  { size: "md", value: 16 },
  { size: "lg", value: 18 },
  { size: "xl", value: 20 },
  { size: "xxl", value: 24 },
  { size: "xxxl", value: 28 },
] as const;

export type TextSize = (typeof textSizes)[number]["size"];

export interface ThemedTextProps extends ShortStyles {
  style?: TextStyle;
  textProps?: TextProps;
  children?: ReactNode;
}

export type FontWeight =
  | "extralight"
  | "light"
  | "regular"
  | "semibold"
  | "extrabold"
  | "bold"
  | "black"
  | "medium"
  | "normal";

type presetColors = keyof ColorOptions;

interface ShortStyles extends Omit<TextStyle, "fontWeight" | "color"> {
  color?: TextStyle["color"] | presetColors;
  case?: Parameters<typeof changeCase>[1];
  fontWeight?: FontWeight;
  size?: TextStyle["fontSize"] | TextSize;
  align?: TextStyle["textAlign"];
  darkModeColor?: TextStyle["color"];
  px?: TextStyle["paddingHorizontal"];
  py?: TextStyle["paddingVertical"];
  pa?: TextStyle["padding"];
  mx?: TextStyle["marginHorizontal"];
  my?: TextStyle["marginVertical"];
  ma?: TextStyle["margin"];
  pt?: TextStyle["paddingTop"];
  pb?: TextStyle["paddingBottom"];
  pl?: TextStyle["paddingLeft"];
  pr?: TextStyle["paddingRight"];
  mt?: TextStyle["marginTop"];
  mb?: TextStyle["marginBottom"];
  ml?: TextStyle["marginLeft"];
  mr?: TextStyle["marginRight"];
}
