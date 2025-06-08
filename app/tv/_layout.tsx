import Box from "@/components/reusables/Box";
import ThemedText from "@/components/reusables/ThemedText";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        presentation: "modal",
        headerShown: false,
        unstable_sheetFooter: () => (
          <Box>
            <ThemedText>
              Lorem Do dolore aute velit id aliqua ut enim.
            </ThemedText>
          </Box>
        ),
      }}
    />
  );
}
