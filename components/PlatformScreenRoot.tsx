import { sHeight } from "@/constants/dimensions.constant";
import { ReactNode } from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Box from "./reusables/Box";
import Page from "./reusables/Page";

export function ScreenRoot({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();

  if (Platform.OS === "ios") {
    return (
      <Page
        px={0}
        py={0}
        pb={insets.bottom + 10}
        height={sHeight - insets.top}
        justify="space-between"
      >
        {children}
      </Page>
    );
  }

  return (
    <Box height={"100%"} pb={20} justify="space-between">
      {children}
    </Box>
  );
}
