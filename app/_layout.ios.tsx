import { QueryClient } from "@tanstack/react-query";
import { Stack } from "expo-router";
import "react-native-reanimated";
import AppProviders from "@/components/AppProviders";
import { Platform } from "react-native";
import { useTheme } from "@/hooks/useTheme.hook";

export const queryClient = new QueryClient();

export default function RootLayout() {
  const theme = useTheme();
  return (
    <AppProviders>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="search"
          options={{
            presentation: "formSheet",
            headerShown: false,
            sheetCornerRadius: 40,
            contentStyle: {
              // color on Ipad only
              backgroundColor:
                Platform.OS === "ios" ? theme.surface : theme.background,
            },
          }}
        />
        <Stack.Screen
          name="movie"
          options={{
            presentation: "formSheet",
            sheetCornerRadius: 40,
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
            presentation: "formSheet",
            headerShown: false,
            sheetCornerRadius: 40,
            contentStyle: {
              backgroundColor: theme.background,
              height: "100%",
            },
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </AppProviders>
  );
}
