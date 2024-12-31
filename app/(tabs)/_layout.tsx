import ThemedButton from "@/components/reusables/ThemedButton";
import { useTheme, useThemeMode } from "@/hooks/useTheme.hook";
import { LinearGradient } from "expo-linear-gradient";
import { router, usePathname } from "expo-router";
import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
  const theme = useTheme();
  const themeMode = useThemeMode();
  const currentPath = usePathname();
  return (
    <Tabs>
      <TabSlot />
      <TabList
        style={{
          justifyContent: "center",
          gap: 20,
          paddingTop: 10,
        }}
        asChild
      >
        <LinearGradient
          colors={[
            themeMode === "dark" ? "rgba(32,32,32,0)" : "rgba(255,255,255,0)",
            theme.background,
            theme.background,
          ]}
          style={{
            position: "absolute",
            bottom: 0,
            paddingTop: 20,
            paddingBottom: 20,
            width: "100%",
            height: 80,
            transform: [
              {
                translateY: -10,
              },
            ],
            flexDirection: "row",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <TabTrigger name="index" href="/">
            <ThemedButton
              px={10}
              py={5}
              size="lg"
              type="text"
              opacity={currentPath === "/" ? 1 : 0.6}
              icon={{
                name: currentPath === "/" ? "albums" : "albums-outline",
                source: "Ionicons",
              }}
              onPress={() => {
                router.push("/");
              }}
            />
          </TabTrigger>
          <TabTrigger name="watchlist" href="/watchlist">
            <ThemedButton
              px={10}
              py={5}
              size="lg"
              type="text"
              opacity={currentPath === "/watchlist" ? 1 : 0.6}
              icon={{
                name: currentPath === "/watchlist" ? "film" : "film-outline",
                source: "Ionicons",
              }}
              onPress={() => {
                router.push("/watchlist");
              }}
            />
          </TabTrigger>
          <TabTrigger name="settings" href="/settings">
            <ThemedButton
              px={10}
              py={5}
              size="lg"
              type="text"
              opacity={currentPath === "/settings" ? 1 : 0.6}
              icon={{
                name:
                  currentPath === "/settings" ? "settings" : "settings-outline",
                source: "Ionicons",
              }}
              onPress={() => {
                router.push("/settings");
              }}
            />
          </TabTrigger>
        </LinearGradient>
      </TabList>
    </Tabs>
  );
}
