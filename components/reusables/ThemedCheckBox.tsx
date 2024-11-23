import React from "react";
import Box from "./Box";
import ThemedButton, { ThemedButtonProps } from "./ThemedButton";
import ThemedIcon from "./ThemedIcon";
import ThemedText from "./ThemedText";

export default function ThemedCheckBox({
  checked = false,
  onLabelPress,
  label,
  ...props
}: ThemedCheckBoxProps) {
  return (
    <Box direction="row" gap={10}>
      <ThemedButton
        size="sm"
        radius={5}
        type={checked ? "primary" : "primary-outlined"}
        height={20}
        width={20}
        {...props}
      >
        <>{checked && <ThemedIcon name="check" size="xs" color="white" />}</>
      </ThemedButton>
      {label && (
        <ThemedButton type="text" onPress={onLabelPress}>
          <ThemedText size={"sm"}>{label}</ThemedText>
        </ThemedButton>
      )}
    </Box>
  );
}

interface ThemedCheckBoxProps extends ThemedButtonProps {
  checked?: boolean;
  label?: string;
  onLabelPress?: () => void;
}
