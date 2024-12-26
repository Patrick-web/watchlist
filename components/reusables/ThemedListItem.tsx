import { useTheme } from "@/hooks/useTheme.hook";
import { ReactNode } from "react";
import { Platform, StyleSheet } from "react-native";
import Box, { BoxProps } from "./Box";
import ThemedText from "./ThemedText";

export default function ThemedListItem({
  label,
  value,
  noDivider,
  varaint = "vertical",
  children,
  rightChild,
  textColor,
  ...props
}: ThemedListItemProps) {
  const theme = useTheme();

  return (
    <Box
      block
      py={10}
      px={15}
      gap={5}
      style={{
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: theme.stroke,
      }}
      direction={varaint === "vertical" ? "column" : "row"}
      justify={varaint === "vertical" ? "flex-start" : "space-between"}
      align={varaint === "vertical" ? "flex-start" : "center"}
      {...props}
    >
      {label && (
        <ThemedText
          size={"sm"}
          fontWeight={varaint === "vertical" ? "light" : "normal"}
          color={textColor || theme.text}
          opacity={varaint === "vertical" ? 1 : 0.8}
          flex={varaint === "vertical" ? undefined : 0.5}
        >
          {label}
        </ThemedText>
      )}
      <Box
        direction="row"
        justify="space-between"
        align="center"
        flex={varaint === "vertical" ? undefined : 0.5}
      >
        {value && (
          <ThemedText
            size={"sm"}
            fontWeight={varaint === "vertical" ? "normal" : "medium"}
            color={textColor || theme.text}
          >
            {value}
          </ThemedText>
        )}
        {rightChild}
      </Box>
      {children}
    </Box>
  );
}

export interface ThemedListItemProps extends BoxProps {
  label?: string;
  value?: string;
  noDivider?: boolean;
  rightChild?: ReactNode;
  textColor?: string;
  varaint?: "vertical" | "horizontal";
  children?: ReactNode;
}
