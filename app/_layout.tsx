import { QueryClient } from "@tanstack/react-query";
import { Stack } from "expo-router";
import "react-native-reanimated";
import AppProviders from "@/components/AppProviders";
import {
  SafeAreaContext,
  SafeAreaProvider,
} from "react-native-safe-area-context";

export const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProviders>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="search"
            options={{
              presentation: "modal",
              headerShown: false,
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </AppProviders>
    </SafeAreaProvider>
  );
}
