import { QueryClient } from "@tanstack/react-query";
import { Stack } from "expo-router";
import "react-native-reanimated";
import AppProviders from "@/components/AppProviders";

export const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="search"
          options={{
            presentation: "formSheet",
            headerShown: false,
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </AppProviders>
  );
}
