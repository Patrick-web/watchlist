import { QueryClient } from "@tanstack/react-query";
import { Stack } from "expo-router";
import "react-native-reanimated";
import AppProviders from "@/components/AppProviders";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme.hook";

export const queryClient = new QueryClient();

export default function RootLayout() {
  const theme = useTheme();
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
          <Stack.Screen
            name="movie"
            options={{
              headerShown: false,
              contentStyle: {
                backgroundColor: theme.background,
                height: "100%",
              },
            }}
          />
          <Stack.Screen
            name="tv"
            options={{
              headerShown: false,
              contentStyle: {
                backgroundColor: theme.background,
                height: "100%",
              },
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </AppProviders>
    </SafeAreaProvider>
  );
}
