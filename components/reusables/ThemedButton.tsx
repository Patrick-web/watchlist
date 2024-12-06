import React, { ReactNode } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  PressableProps,
  ViewStyle,
} from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme.hook";
import Box, { AnimatedBox, BoxProps } from "./Box";
import ThemedIcon, { ThemedIconProps } from "./ThemedIcon";
import ThemedText, { ThemedTextProps } from "./ThemedText";
import * as Haptics from "expo-haptics";

const ThemedButton = (props: ThemedButtonProps) => {
  const {
    color,
    icon,
    labelProps,
    label,
    loading = false,
    onPress,
    type = "primary",
    disabled = false,
    wrapperProps,
    radius = 40,
    size = "md",
    iconComponent,
    pressabelProps,
    children,
    ...outerWrapperProps
  } = props;

  const sizeStyles = getButtonStyles(size);

  const theme = useTheme();

  const scaleValue = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(
    () =>
      ({
        transform: [{ scale: scaleValue.value }],
      }) as any,
  );

  const handlePressIn = () => {
    if (!disabled && !loading) scaleValue.value = withSpring(0.9);
  };

  const handlePressOut = () => {
    if (!disabled && !loading) scaleValue.value = withSpring(1);
  };

  const iconColor = () => {
    if (icon?.color) return icon.color;
    if (type === "primary") {
      return "white";
    }
    if (type === "primary-outlined") {
      return theme.primary;
    }
    if (type === "secondary-outlined") {
      return theme.text;
    }
    if (type === "surface") {
      return theme.onSurface;
    }
    if (type === "secondary") {
      return theme.background;
    }
  };

  const labelColor = () => {
    if (type === "primary") {
      return "white";
    }
    if (type === "primary-outlined") {
      return theme.primary;
    }
    if (type === "secondary-outlined") {
      return theme.text;
    }
    if (type === "surface") {
      return theme.onSurface;
    }
    if (type === "secondary") {
      return theme.background;
    }
  };

  const buttonColors = () => {
    if (color) {
      return { background: color, border: "transparent" };
    }
    if (type === "primary") {
      return { background: theme.primary, border: "transparent" };
    }
    if (type === "primary-outlined") {
      return { background: "transparent", border: theme.primary };
    }
    if (type === "surface") {
      return { background: theme.surface, border: theme.border };
    }
    if (type === "secondary-outlined") {
      return { background: "transparent", border: theme.text };
    }
    if (type === "secondary") {
      return { background: theme.text, border: "transparent" };
    }
    return { background: "transparent", border: "transparent" };
  };

  function iconGapBasedOnSize() {
    if (size === "xxxs") return 2;
    if (size === "xxs") return 4;
    if (size === "xs") return 6;
    if (size === "sm") return 8;
    if (size === "md") return 10;
    if (size === "lg") return 12;
    if (size === "xl") return 14;
    if (size === "xxl") return 16;
    if (size === "xxxl") return 18;
  }

  const ButtonIcon = ({ icon }: { icon: ThemedIconProps }) => (
    <ThemedIcon
      size={icon.size ? icon.size : size}
      color={iconColor()}
      {...icon}
    />
  );

  return (
    <AnimatedBox
      style={animatedButtonStyle}
      radius={radius}
      color={buttonColors()?.background}
      borderColor={buttonColors()?.border}
      borderWidth={
        type.includes("outlined") || type.includes("surface") ? 1 : 0
      }
      align="center"
      justify="center"
      {...outerWrapperProps}
      opacity={disabled ? 0.7 : 1}
    >
      <Pressable
        style={{
          width: "100%",
          alignItems: outerWrapperProps.align || "stretch",
          justifyContent: outerWrapperProps.justify || "center",
          paddingVertical: outerWrapperProps.py
            ? outerWrapperProps.py
            : children
              ? 0
              : Platform.OS === "android"
                ? sizeStyles.paddingVertical / 1.2
                : sizeStyles.paddingVertical,
          paddingHorizontal: outerWrapperProps.px
            ? outerWrapperProps.px
            : children
              ? 0
              : sizeStyles.paddingHorizontal,
          borderRadius: radius,
        }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          if (onPress) onPress();
        }}
        disabled={disabled || loading}
        {...pressabelProps}
      >
        {children ? (
          <>
            {loading && (
              <ActivityIndicator size={"small"} color={labelColor()} />
            )}
            {children}
          </>
        ) : (
          <Box
            gap={icon ? (icon.gap ? icon.gap : iconGapBasedOnSize()) : 0}
            radius={40}
            direction={outerWrapperProps.direction || "row"}
            align="center"
            justify="center"
            {...wrapperProps}
          >
            {loading && (
              <ActivityIndicator size={"small"} color={labelColor()} />
            )}
            {loading === false && (
              <>
                {icon && icon.position !== "append" && (
                  <ButtonIcon icon={icon} />
                )}
                {iconComponent && <>{iconComponent}</>}
                {label && (
                  <ThemedText
                    color={labelColor()}
                    size={size}
                    fontWeight="medium"
                    {...labelProps}
                  >
                    {label}
                  </ThemedText>
                )}
                {icon && icon.position === "append" && (
                  <ButtonIcon icon={icon} />
                )}
              </>
            )}
          </Box>
        )}
      </Pressable>
    </AnimatedBox>
  );
};

export default ThemedButton;

export function SectionButton(props: ThemedButtonProps) {
  const theme = useTheme();

  return (
    <ThemedButton
      px={0}
      radius={30}
      icon={{
        name: "chevron-right",
        size: 24,
        position: "append",
      }}
      type="surface"
      wrapperProps={{ justify: "space-between" }}
      height={60}
      {...props}
      labelProps={{
        size: 14,
        ...props.labelProps,
      }}
    />
  );
}

export function ThemedIconButton({
  type = "text",
  icon,
  size = 40,
  height,
  width,
  background,
  radius = 60,
  ...pressableProps
}: IconButtonProps) {
  const theme = useTheme();

  const buttonColors = () => {
    if (background) {
      return { background, border: "transparent" };
    }
    if (type === "primary") {
      return { background: theme.stroke, border: "transparent" };
    }
    if (type === "primary-outlined") {
      return { background: "transparent", border: theme.stroke };
    }
    if (type === "secondary-outlined") {
      return { background: "transparent", border: theme.text };
    }
    if (type === "secondary") {
      return { background: theme.text, border: "transparent" };
    }
    return { background: "transparent", border: "transparent" };
  };

  const iconColor = () => {
    if (icon?.color) return icon.color;
    if (type === "primary") {
      return "white";
    }
    if (type === "primary-outlined" || type === "secondary-outlined") {
      return theme.text;
    }
    if (type === "secondary") {
      return theme.background;
    }
  };

  return (
    <Pressable
      {...pressableProps}
      style={{
        backgroundColor: buttonColors().background,
        borderColor: buttonColors().border,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        height: height ? height : size,
        width: width ? width : size,
        borderRadius: radius,
      }}
      android_ripple={{
        borderless: true,
      }}
    >
      <ThemedIcon {...icon} color={iconColor()} />
    </Pressable>
  );
}

export function ThemedToggleButton(props: ToggleButtonProps) {
  return (
    <ThemedButton
      type={props.active ? "primary-outlined" : "text"}
      borderWidth={2}
      {...props}
    />
  );
}

export function ThemedListButton(
  props: ThemedButtonProps & { noUnderline?: boolean },
) {
  const theme = useTheme();
  return (
    <ThemedButton
      type="text"
      borderColor={theme.stroke}
      borderBottomWidth={props.noUnderline ? 0 : 1}
      pa={15}
      radius={0}
      {...props}
      icon={undefined}
    >
      <Box direction="row" align="center" justify="space-between" block>
        <Box direction="row" gap={10} align="center">
          {props.icon && <ThemedIcon {...props.icon} />}
          <ThemedText size="sm" fontWeight="medium" {...props.labelProps}>
            {props.label}
          </ThemedText>
        </Box>
        {props.rightChild ? (
          props.rightChild
        ) : (
          <ThemedIcon name="chevron-right" />
        )}
      </Box>
    </ThemedButton>
  );
}

type BoxWrapper = Omit<BoxProps, "children">;
export interface ThemedButtonProps extends BoxWrapper {
  color?: string;
  label?: string | number;
  labelProps?: Omit<ThemedTextProps, "children">;
  loading?: boolean;
  onPress?: () => void;
  icon?: ButtonIconProps;
  iconComponent?: ReactNode;
  type?:
    | "text"
    | "secondary"
    | "surface"
    | "primary"
    | "primary-outlined"
    | "secondary-outlined";
  disabled?: boolean;
  wrapperProps?: BoxWrapper;
  size?: ButtonSize;
  radius?: ViewStyle["borderRadius"];
  children?: JSX.Element | JSX.Element[];
  rightChild?: JSX.Element;
  pressabelProps?: PressableProps;
}

interface ButtonIconProps extends ThemedIconProps {
  position?: "append" | "prepend";
  gap?: number;
}

interface IconButtonProps extends PressableProps {
  type?:
    | "text"
    | "secondary"
    | "primary"
    | "primary-outlined"
    | "secondary-outlined";

  icon: ButtonIconProps;
  size?: number;
  height?: number;
  width?: number;
  background?: string;
  radius?: number;
}

interface ToggleButtonProps extends ThemedButtonProps {
  active?: boolean;
}

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

interface ButtonStyles {
  paddingVertical: number;
  paddingHorizontal: number;
}

const getButtonStyles = (size: ButtonSize): ButtonStyles => {
  let styles: ButtonStyles = {
    paddingVertical: 14,
    paddingHorizontal: 18,
  };

  switch (size) {
    case "xxxs":
      styles = {
        paddingVertical: 6,
        paddingHorizontal: 10,
      };
      break;
    case "xxs":
      styles = {
        paddingVertical: 8,
        paddingHorizontal: 12,
      };
      break;
    case "xs":
      styles = {
        paddingVertical: 10,
        paddingHorizontal: 14,
      };
      break;
    case "sm":
      styles = {
        paddingVertical: 12,
        paddingHorizontal: 16,
      };
      break;
    case "md":
      styles = {
        paddingVertical: 14,
        paddingHorizontal: 18,
      };
      break;
    case "lg":
      styles = {
        paddingVertical: 16,
        paddingHorizontal: 20,
      };
      break;
    case "xl":
      styles = {
        paddingVertical: 18,
        paddingHorizontal: 22,
      };
      break;
    case "xxl":
      styles = {
        paddingVertical: 20,
        paddingHorizontal: 24,
      };
      break;
    case "xxxl":
      styles = {
        paddingVertical: 22,
        paddingHorizontal: 26,
      };
      break;
    default:
      // Default values already set
      break;
  }

  return styles;
};
