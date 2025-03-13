import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import React, { ReactNode, Ref, forwardRef } from "react";
import {
  Platform,
  TextInput,
  TextInputProps,
  TextStyle,
  StyleSheet,
} from "react-native";
import { useTheme } from "../../hooks/useTheme.hook";
import Box, { BoxProps } from "./Box";
import Spacer from "./Spacer";
import ThemedText, { ThemedTextProps } from "./ThemedText";

// label component with memo

const Label = React.memo(
  ({ label, labelProps }: { label: string; labelProps?: ThemedTextProps }) => {
    return (
      <>
        <ThemedText size={"sm"} {...labelProps}>
          {label}
        </ThemedText>
        <Spacer height={5} />
      </>
    );
  },
);

Label.displayName = "Label";

// left slot component with memo
const LeftSlot = React.memo(
  ({
    leftSlot,
    leftSlotProps,
  }: {
    leftSlot: ReactNode;
    leftSlotProps: any;
  }) => {
    return (
      <Box align="center" justify="center" {...leftSlotProps}>
        {leftSlot}
      </Box>
    );
  },
);

LeftSlot.displayName = "LeftSlot";

// right slot component with memo
const RightSlot = React.memo(
  ({
    rightSlot,
    rightSlotProps,
  }: {
    rightSlot: ReactNode;
    rightSlotProps: any;
  }) => {
    return (
      <Box align="center" justify="center" {...rightSlotProps}>
        {rightSlot}
      </Box>
    );
  },
);

RightSlot.displayName = "RightSlot";

// Forward ref to ThemedTextInput
const ThemedTextInput = forwardRef(
  (
    {
      wrapper,
      errorMessage,
      errors,
      leftSlot,
      leftSlotProps,
      rightSlot,
      rightSlotProps,
      label,
      labelProps,
      size = "md",
      forBottomSheet = false,
      ...input
    }: ThemedTextInputProps,
    ref: Ref<TextInput>,
  ) => {
    const theme = useTheme();
    const sizeStyles = getTextStyles(size);

    const TextInputComponent = forBottomSheet
      ? BottomSheetTextInput
      : TextInput;

    return (
      <Box>
        {label && <Label label={label} labelProps={labelProps} />}
        <Box
          radius={14}
          borderWidth={StyleSheet.hairlineWidth}
          direction="row"
          align="stretch"
          justify="center"
          borderColor={theme.stroke}
          color={theme.surface2}
          {...wrapper}
        >
          {leftSlot && (
            <LeftSlot leftSlot={leftSlot} leftSlotProps={leftSlotProps} />
          )}

          <TextInputComponent
            //eslint-ignore
            ref={ref as any}
            placeholderTextColor={theme.text}
            {...input}
            style={[
              {
                flex: 1,
                paddingLeft: leftSlot
                  ? sizeStyles.paddingHorizontal / 4
                  : sizeStyles.paddingHorizontal,
                paddingVertical:
                  Platform.OS === "ios"
                    ? sizeStyles.paddingVertical
                    : sizeStyles.paddingVertical / 1.1,
                fontFamily: "Poppins",
                fontSize: sizeStyles.fontSize,
                color: theme.text,
              },
              input.style,
            ]}
          />

          {rightSlot && (
            <RightSlot rightSlot={rightSlot} rightSlotProps={rightSlotProps} />
          )}
        </Box>

        {errorMessage && (
          <ThemedText color={theme.danger} size={12}>
            {errorMessage}
          </ThemedText>
        )}
        {errors && errorMessage?.length && (
          <Box block>
            {errors.map((err) => (
              <ThemedText key={err} color={theme.danger} size={12}>
                {err}
              </ThemedText>
            ))}
          </Box>
        )}
      </Box>
    );
  },
);

ThemedTextInput.displayName = "ThemedTextInput";

export default ThemedTextInput;

type _BoxProps = Omit<BoxProps, "children">;

interface SlotProps extends _BoxProps {
  spacing?: number;
}

export interface ThemedTextInputProps extends TextInputProps {
  wrapper?: Omit<BoxProps, "children">;
  errorMessage?: string | null | undefined;
  errors?: string[];
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  leftSlotProps?: SlotProps;
  rightSlotProps?: SlotProps;
  label?: string;
  labelProps?: ThemedTextProps;
  size?: InputSize | TextStyle["fontSize"];
  forBottomSheet?: boolean;
}

type InputSize =
  | "xxxs"
  | "xxs"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "xxl"
  | "xxxl";

interface InputStyles {
  paddingVertical: number;
  paddingHorizontal: number;
  fontSize: number;
}

const getTextStyles = (
  size: InputSize | TextStyle["fontSize"],
): InputStyles => {
  let styles: InputStyles = {
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 16,
  };

  switch (size) {
    case "xxxs":
      styles = {
        paddingVertical: 6,
        paddingHorizontal: 10,
        fontSize: 6,
      };
      break;
    case "xxs":
      styles = {
        paddingVertical: 2,
        paddingHorizontal: 12,
        fontSize: 8,
      };
      break;
    case "xs":
      styles = {
        paddingVertical: 0,
        paddingHorizontal: 14,
        fontSize: 10,
      };
      break;
    case "sm":
      styles = {
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 12,
      };
      break;
    case "md":
      styles = {
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 14,
      };
      break;
    case "lg":
      styles = {
        paddingVertical: 16,
        paddingHorizontal: 20,
        fontSize: 16,
      };
      break;
    case "xl":
      styles = {
        paddingVertical: 18,
        paddingHorizontal: 22,
        fontSize: 18,
      };
      break;
    case "xxl":
      styles = {
        paddingVertical: 20,
        paddingHorizontal: 24,
        fontSize: 20,
      };
      break;
    case "xxxl":
      styles = {
        paddingVertical: 22,
        paddingHorizontal: 26,
        fontSize: 22,
      };
      break;
    default:
      styles = {
        paddingVertical: 20,
        paddingHorizontal: 20,
        fontSize: typeof size === "number" ? size : 14,
      };
      break;
  }

  return styles;
};
