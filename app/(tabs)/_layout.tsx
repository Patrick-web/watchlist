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
    <SafeAreaView style={{ flex: 1 }}>
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
            ]}
            style={{
              position: "absolute",
              bottom: 0,
              paddingTop: 20,
              paddingBottom: 20,
              width: "100%",
              flexDirection: "row",
              justifyContent: "center",
              gap: 20,
            }}
          >
            <TabTrigger name="index" href="/">
              <ThemedButton
                px={10}
                py={5}
                size="sm"
                type={currentPath === "/" ? "primary" : "surface"}
                icon={{ name: "filmstrip", source: "MaterialCommunityIcons" }}
                onPress={() => {
                  router.push("/");
                }}
              />
            </TabTrigger>
            <TabTrigger name="watchlist" href="/watchlist">
              <ThemedButton
                px={10}
                py={5}
                size="sm"
                type={currentPath === "/watchlist" ? "primary" : "surface"}
                icon={{
                  name: "video-vintage",
                  source: "MaterialCommunityIcons",
                }}
                onPress={() => {
                  router.push("/watchlist");
                }}
              />
            </TabTrigger>
            <ThemedButton
              px={10}
              py={5}
              size="sm"
              type={currentPath === "/search" ? "primary" : "surface"}
              icon={{ name: "search" }}
              onPress={() => {
                router.push("/search");
              }}
            />
          </LinearGradient>
        </TabList>
      </Tabs>
    </SafeAreaView>
  );
}
