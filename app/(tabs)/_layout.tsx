import ThemedButton from "@/components/reusables/ThemedButton";
import { useTheme } from "@/hooks/useTheme.hook";
import { LinearGradient } from "expo-linear-gradient";
import { router, usePathname } from "expo-router";
import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
  const theme = useTheme();
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
            colors={["rgba(32,32,32,0)", theme.background]}
            style={{
              position: "absolute",
              bottom: 0,
              paddingTop: 20,
              width: "100%",
              flexDirection: "row",
              justifyContent: "center",
              gap: 20,
            }}
          >
            <TabTrigger name="fresh" href="/">
              <ThemedButton
                px={10}
                py={5}
                size="sm"
                type={currentPath === "/" ? "primary" : "surface"}
                icon={{ name: "activity" }}
                onPress={() => {
                  router.push("/");
                }}
              />
            </TabTrigger>
            <TabTrigger name="search" href="/shows">
              <ThemedButton
                px={10}
                py={5}
                size="sm"
                type={currentPath === "/shows" ? "primary" : "surface"}
                icon={{ name: "film" }}
                onPress={() => {
                  router.push("/shows");
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
