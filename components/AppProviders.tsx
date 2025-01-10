import React, { ReactNode, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Toaster } from "sonner-native";
import { useTheme, useThemeMode } from "@/hooks/useTheme.hook";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import { setupValtio } from "@/valitio.store";
import { useFonts } from "expo-font";

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const queryClient = new QueryClient();

const AppProviders = ({ children }: { children: ReactNode }) => {
  const themeMode = useThemeMode();
  const theme = useTheme();

  const [loaded] = useFonts({
    SpaceGrotesk: require("../assets/fonts/SpaceGrotesk/SpaceGrotesk-Regular.ttf"),
    SpaceGroteskMedium: require("../assets/fonts/SpaceGrotesk/SpaceGrotesk-Medium.ttf"),
    SpaceGroteskBold: require("../assets/fonts/SpaceGrotesk/SpaceGrotesk-Bold.ttf"),
    SpaceGroteskLight: require("../assets/fonts/SpaceGrotesk/SpaceGrotesk-Light.ttf"),
  });

  async function getScheduled() {
    const nots = await Notifications.getAllScheduledNotificationsAsync();
    // console.log({ nots });
  }

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  // valtio persit setup
  useEffect(() => {
    const unsubscribe = setupValtio();
    getScheduled();

    return () => unsubscribe();
  }, []);

  if (!loaded) {
    return null;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <SafeAreaProvider style={{ flex: 1 }}>
            <ThemeProvider
              value={{
                dark: themeMode === "dark",
                colors: theme,
                fonts: DarkTheme.fonts,
              }}
            >
              <Toaster />
              {children}
            </ThemeProvider>
          </SafeAreaProvider>
          <StatusBar style="auto" />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default AppProviders;
