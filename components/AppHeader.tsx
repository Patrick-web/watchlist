import { ReactNode } from "react";
import Box from "./reusables/Box";
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
