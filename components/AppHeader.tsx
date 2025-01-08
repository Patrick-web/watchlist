import { router } from "expo-router";
import { ReactNode } from "react";
import { Platform } from "react-native";
import Box from "./reusables/Box";
import ThemedButton from "./reusables/ThemedButton";
import ThemedText from "./reusables/ThemedText";

interface AppHeaderProps {
  title: string;
  children?: ReactNode;
}

export default function AppHeader({ title, children }: AppHeaderProps) {
  return (
    <Box pb={10} direction="row" justify="space-between" align="center">
      <ThemedText size={"xl"} fontWeight="bold">
        {title}
      </ThemedText>
      {children}
    </Box>
  );
}
