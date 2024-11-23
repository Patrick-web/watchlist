import { useTheme, useThemeMode } from "@/hooks/useTheme.hook";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const queryClient = new QueryClient();

export default function RootLayout() {
  const themeMode = useThemeMode();
  const theme = useTheme();

  const [loaded, fonts] = useFonts({
    SpaceGrotesk: require("../assets/fonts/SpaceGrotesk/SpaceGrotesk-Regular.ttf"),
    SpaceGroteskMedium: require("../assets/fonts/SpaceGrotesk/SpaceGrotesk-Medium.ttf"),
    SpaceGroteskBold: require("../assets/fonts/SpaceGrotesk/SpaceGrotesk-Bold.ttf"),
    SpaceGroteskLight: require("../assets/fonts/SpaceGrotesk/SpaceGrotesk-Light.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <SafeAreaProvider>
            <ThemeProvider
              value={{
                dark: themeMode === "dark",
                colors: theme,
                fonts: DarkTheme.fonts,
              }}
            >
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
                <Stack.Screen
                  name="search"
                  options={{ presentation: "modal", headerShown: false }}
                />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
          </SafeAreaProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
