import React, { forwardRef, ReactNode } from "react";
import { Text, TextProps, TextStyle } from "react-native";
import { ColorOptions } from "@/constants/colors.constants";
import { changeCase } from "@/utils/text.utils";
import { useTheme } from "../../hooks/useTheme.hook";

const ThemedText = forwardRef(
  (
    {
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
    }: ThemedTextProps,
    ref: React.Ref<Text>,
  ) => {
    const theme = useTheme();

    const textColor = getTextColor(theme, color, darkModeColor);
    const textSize = getTextSize(size);
    const $fontFamily = getFontFamily(fontFamily, fontWeight);

    return (
      <Text
        style={[
          {
            color: textColor,
            fontSize: textSize,
            fontFamily: $fontFamily,
            ...generateStylesObject(styleProps),
          },
          style,
        ]}
        {...textProps}
        ref={ref}
      >
        {textCase ? changeCase(children as string, textCase) : children}
      </Text>
    );
  },
);

ThemedText.displayName = 'ThemedText';

export default ThemedText;

function mapFontweightToFontFamily(
  weight: FontWeight,
  fontPrefix = "SpaceGrotesk",
): string | undefined {
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

function getTextSize(size: TextSize | number = "md") {
  if (typeof size === "string") {
    const foundSize = textSizes.find((options) => options.size === size);
    if (!foundSize)
      return textSizes.find((options) => options.size === "md")!.value;
    return foundSize.value;
  } else {
    return size;
  }
}

function getTextColor(
  theme: ColorOptions,
  color?: ThemedTextProps["color"],
  darkModeColor?: ThemedTextProps["color"],
) {
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
}

const getFontFamily = (
  fontFamily: string | undefined,
  fontWeight: FontWeight | undefined,
) => {
  if (fontWeight) {
    return mapFontweightToFontFamily(fontWeight);
  }
  return fontFamily;
};
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
  fontFamily?: string;
  fontWeight?: FontWeight;
  color?: TextStyle["color"] | presetColors;
  case?: Parameters<typeof changeCase>[1];
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
