import { ColorOptions } from "@/constants/colors.constants";
import { useTheme } from "@/hooks/useTheme.hook";
import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
} from "@expo/vector-icons";
import React from "react";

export default function ThemedIcon({
  name,
  color,
  size = "md",
  source = "Feather",
}: ThemedIconProps) {
  const theme = useTheme();

  const iconSize = () => {
    if (typeof size === "string") {
      return iconSizes.find((options) => options.size === size)!.value;
    } else {
      return size;
    }
  };

  const iconColor = () => {
    if (color) {
      // check if color is included in the theme.colors and return its value if it is
      if (theme[color as keyof ColorOptions]) {
        return theme[color as keyof ColorOptions];
      }
      return color;
    }
    return theme.text;
  };

  return (
    <>
      {source === "Feather" && (
        <Feather
          name={name as keyof typeof Feather.glyphMap}
          size={iconSize()}
          color={iconColor()}
        />
      )}
      {source === "AntDesign" && (
        <AntDesign
          name={name as keyof typeof AntDesign.glyphMap}
          size={iconSize()}
          color={iconColor()}
        />
      )}
      {source === "Entypo" && (
        <Entypo
          name={name as keyof typeof Entypo.glyphMap}
          size={iconSize()}
          color={iconColor()}
        />
      )}
      {source === "EvilIcons" && (
        <EvilIcons
          name={name as keyof typeof EvilIcons.glyphMap}
          size={iconSize()}
          color={iconColor()}
        />
      )}
      {source === "FontAwesome" && (
        <FontAwesome
          name={name as keyof typeof FontAwesome.glyphMap}
          size={iconSize()}
          color={iconColor()}
        />
      )}
      {source === "FontAwesome5" && (
        <FontAwesome5
          name={name as keyof typeof FontAwesome.glyphMap}
          size={iconSize()}
          color={iconColor()}
        />
      )}
      {source === "FontAwesome6" && (
        <FontAwesome6
          name={name as keyof typeof FontAwesome.glyphMap}
          size={iconSize()}
          color={iconColor()}
        />
      )}
      {source === "Fontisto" && (
        <Fontisto
          name={name as keyof typeof Fontisto.glyphMap}
          size={iconSize()}
          color={iconColor()}
        />
      )}
      {source === "Foundation" && (
        <Foundation
          name={name as keyof typeof Foundation.glyphMap}
          size={iconSize()}
          color={iconColor()}
        />
      )}
      {source === "Ionicons" && (
        <Ionicons
          name={name as keyof typeof Ionicons.glyphMap}
          size={iconSize()}
          color={iconColor()}
        />
      )}
      {source === "MaterialCommunityIcons" && (
        <MaterialCommunityIcons
          name={name as keyof typeof MaterialCommunityIcons.glyphMap}
          size={iconSize()}
          color={iconColor()}
        />
      )}
      {source === "MaterialIcons" && (
        <MaterialIcons
          name={name as keyof typeof MaterialIcons.glyphMap}
          size={iconSize()}
          color={iconColor()}
        />
      )}
      {source === "Octicons" && (
        <Octicons
          name={name as keyof typeof Octicons.glyphMap}
          size={iconSize()}
          color={iconColor()}
        />
      )}
      {source === "SimpleLineIcons" && (
        <SimpleLineIcons
          name={name as keyof typeof SimpleLineIcons.glyphMap}
          size={iconSize()}
          color={iconColor()}
        />
      )}
      {source === "Zocial" && (
        <Zocial
          name={name as keyof typeof Zocial.glyphMap}
          size={iconSize()}
          color={iconColor()}
        />
      )}
    </>
  );
}

export interface ThemedIconProps {
  source?:
    | "AntDesign"
    | "Entypo"
    | "EvilIcons"
    | "Feather"
    | "FontAwesome"
    | "FontAwesome5"
    | "FontAwesome6"
    | "Fontisto"
    | "Foundation"
    | "Ionicons"
    | "MaterialCommunityIcons"
    | "MaterialIcons"
    | "Octicons"
    | "SimpleLineIcons"
    | "Zocial";
  name:
    | keyof typeof Feather.glyphMap
    | keyof typeof AntDesign.glyphMap
    | keyof typeof Entypo.glyphMap
    | keyof typeof EvilIcons.glyphMap
    | keyof typeof FontAwesome.glyphMap
    | keyof typeof Fontisto.glyphMap
    | keyof typeof Foundation.glyphMap
    | keyof typeof Ionicons.glyphMap
    | keyof typeof MaterialCommunityIcons.glyphMap
    | keyof typeof MaterialCommunityIcons.glyphMap
    | keyof typeof MaterialIcons.glyphMap
    | keyof typeof Octicons.glyphMap
    | keyof typeof SimpleLineIcons.glyphMap
    | keyof typeof Zocial.glyphMap;
  size?: number | TextSize;
  color?: string;
}

const iconSizes = [
  { size: "xxxs", value: 10 },
  { size: "xxs", value: 12 },
  { size: "xs", value: 14 },
  { size: "sm", value: 16 },
  { size: "md", value: 18 },
  { size: "lg", value: 20 },
  { size: "xl", value: 22 },
  { size: "xxl", value: 24 },
  { size: "xxxl", value: 26 },
] as const;

type TextSize = (typeof iconSizes)[number]["size"];
