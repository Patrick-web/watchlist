import React from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme.hook";
import Box, { BoxProps } from "./Box";
import ThemedButton from "./ThemedButton";
import ThemedText from "./ThemedText";

export default function ThemedSegmentedPicker<T>({
  options,
  selectedIndex,
  selectedValue,
  onSelect,
  getLabel,
  getValue,
  disabled = false,
  size = "sm",
  ...boxProps
}: ThemedSegmentedPickerProps<T>) {
  const theme = useTheme();

  // Determine selected index based on selectedValue if provided
  const currentSelectedIndex = React.useMemo(() => {
    if (selectedIndex !== undefined) {
      return selectedIndex;
    }
    if (selectedValue !== undefined && getValue) {
      return options.findIndex((option) => getValue(option) === selectedValue);
    }
    return 0;
  }, [selectedIndex, selectedValue, options, getValue]);

  const handleSelect = (index: number, option: T) => {
    if (disabled) return;

    if (onSelect) {
      onSelect({
        index,
        option,
        value: getValue ? getValue(option) : option,
      });
    }
  };

  const getOptionLabel = (option: T): string => {
    if (getLabel) {
      return getLabel(option);
    }
    if (typeof option === "string") {
      return option;
    }
    return String(option);
  };

  return (
    <Box
      direction="row"
      radius={25}
      color={theme.surface}
      borderWidth={StyleSheet.hairlineWidth}
      borderColor={theme.stroke}
      overflow="hidden"
      opacity={disabled ? 0.6 : 1}
      pa={2}
      {...boxProps}
    >
      {options.map((option, index) => {
        const isSelected = index === currentSelectedIndex;

        return (
          <ThemedButton
            key={index}
            type={isSelected ? "secondary" : "surface"}
            size={size}
            radius={20}
            flex={1}
            disabled={disabled}
            onPress={() => handleSelect(index, option)}
            mx={1}
            py={4}
            label={getOptionLabel(option)}
          />
        );
      })}
    </Box>
  );
}

export interface ThemedSegmentedPickerProps<T>
  extends Omit<BoxProps, "children"> {
  options: T[];
  selectedIndex?: number;
  selectedValue?: T;
  onSelect?: (selection: { index: number; option: T; value: T }) => void;
  getLabel?: (option: T) => string;
  getValue?: (option: T) => T;
  disabled?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
}
