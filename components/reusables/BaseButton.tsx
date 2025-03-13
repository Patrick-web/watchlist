import React, { forwardRef } from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  ViewStyle,
  StyleSheet,
  View,
} from "react-native";
import { FadeIn } from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme.hook";
import { AnimatedBox, generateStylesObject, ShortStyles } from "./Box";
import ThemedIcon, { ThemedIconProps } from "./ThemedIcon";
import ThemedText, { ThemedTextProps } from "./ThemedText";
import { ColorOptions } from "@/constants/colors.constants";

interface ButtonIconProps extends ThemedIconProps {
  position?: "append" | "prepend";
  gap?: number;
}
type BaseButtonProps = ShortStyles &
  PressableProps & {
    loading?: boolean;
    label?: string | number;
    labelProps?: Omit<ThemedTextProps, "children">;
    icon?: ButtonIconProps;
    type?:
      | "text"
      | "secondary"
      | "surface"
      | "primary"
      | "primary-outlined"
      | "secondary-outlined";
    size?: ButtonSize;
  };

const BaseButton = forwardRef<View, BaseButtonProps>((props, ref) => {
  const theme = useTheme();

  const boxColor = () => {
    if (props.color) {
      if (theme[props.color as keyof ColorOptions]) {
        return theme[props.color as keyof ColorOptions];
      }
      return props.color;
    }
    return null;
  };

  const iconColor = () => {
    if (props.icon?.color) return props.icon.color;
    if (props.type === "primary") {
      return "white";
    }
    if (props.type === "primary-outlined") {
      return theme.primary;
    }
    if (props.type === "secondary-outlined") {
      return theme.text;
    }
    if (props.type === "surface") {
      return theme.onSurface;
    }
    if (props.type === "secondary") {
      return theme.background;
    }
  };

  const labelColor = () => {
    if (props.type === "primary") {
      return "white";
    }
    if (props.type === "primary-outlined") {
      return theme.primary;
    }
    if (props.type === "secondary-outlined") {
      return theme.text;
    }
    if (props.type === "surface") {
      return theme.onSurface;
    }
    if (props.type === "secondary") {
      return theme.background;
    }
  };

  const buttonColors = () => {
    if (props.color) {
      return { background: props.color, border: "transparent" };
    }
    if (props.type === "primary") {
      return { background: theme.primary, border: "transparent" };
    }
    if (props.type === "primary-outlined") {
      return { background: "transparent", border: theme.primary };
    }
    if (props.type === "surface") {
      return { background: theme.surface, border: theme.border };
    }
    if (props.type === "secondary-outlined") {
      return { background: "transparent", border: theme.text };
    }
    if (props.type === "secondary") {
      return { background: theme.text, border: "transparent" };
    }
    return { background: "transparent", border: "transparent" };
  };

  function iconGapBasedOnSize() {
    if (props.size === "xxxs") return 2;
    if (props.size === "xxs") return 4;
    if (props.size === "xs") return 6;
    if (props.size === "sm") return 8;
    if (props.size === "md") return 10;
    if (props.size === "lg") return 12;
    if (props.size === "xl") return 14;
    if (props.size === "xxl") return 16;
    if (props.size === "xxxl") return 18;
  }

  const borderWidth = () =>
    props?.type &&
    (props?.type.includes("outlined") || props?.type.includes("surface"))
      ? StyleSheet.hairlineWidth
      : 0;

  const combinedStyles = [
    {
      gap: props.icon
        ? props.icon.gap
          ? props.icon.gap
          : iconGapBasedOnSize()
        : 0,
      borderRadius: 40,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      color: buttonColors()?.background,
      borderColor: buttonColors()?.border,
      borderWidth: borderWidth(),
    } as ViewStyle,
    generateStylesObject({ ...props, color: boxColor() }) as ViewStyle,
    props.style as ViewStyle,
  ];

  const ButtonIcon = ({ icon }: { icon: ThemedIconProps }) => (
    <AnimatedBox
      viewProps={{
        entering: FadeIn,
      }}
    >
      <ThemedIcon
        size={icon.size ? icon.size : props.size}
        color={iconColor()}
        {...icon}
      />
    </AnimatedBox>
  );
  return (
    <Pressable ref={ref} style={combinedStyles} {...props}>
      {props.children ? (
        <>
          {props.loading && (
            <ActivityIndicator size={"small"} color={labelColor()} />
          )}
          {props.children}
        </>
      ) : (
        <>
          {props.loading && (
            <ActivityIndicator size={"small"} color={labelColor()} />
          )}
          {props.loading === false && (
            <>
              {props.icon && props.icon.position !== "append" && (
                <ButtonIcon icon={props.icon} />
              )}
              {props.label && (
                <ThemedText
                  color={labelColor()}
                  size={props.size}
                  fontWeight="medium"
                  {...props.labelProps}
                >
                  {props.label}
                </ThemedText>
              )}
              {props.icon && props.icon.position === "append" && (
                <ButtonIcon icon={props.icon} />
              )}
            </>
          )}
        </>
      )}
    </Pressable>
  );
});

BaseButton.displayName = 'BaseButton';

export default BaseButton;

type ButtonSize =
  | "xxxs"
  | "xxs"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "xxl"
  | "xxxl";
