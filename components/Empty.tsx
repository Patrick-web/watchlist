import { useTheme } from "@/hooks/useTheme.hook";
import Box from "./reusables/Box";
import ThemedIcon from "./reusables/ThemedIcon";
import ThemedText from "./reusables/ThemedText";
import { ReactNode } from "react";

interface EmptyProps {
  message: string;
  children?: ReactNode;
}

export default function Empty({ message, children }: EmptyProps) {
  const theme = useTheme();
  return (
    <Box
      align="center"
      gap={10}
      color={theme.surface}
      pa={20}
      radius={80}
      my={"auto"}
    >
      <Box align="center" gap={5}>
        <ThemedIcon name="wind" source="Fontisto" size={"xxxl"} />
        <ThemedText fontWeight="light">{message}</ThemedText>
      </Box>
      {children}
    </Box>
  );
}
