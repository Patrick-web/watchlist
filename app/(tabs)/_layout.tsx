import ThemedIcon, { ThemedIconProps } from "@/components/reusables/ThemedIcon";
import { useTheme, useThemeMode } from "@/hooks/useTheme.hook";
import { LinearGradient } from "expo-linear-gradient";
import {
  TabList,
  Tabs,
  TabSlot,
  TabTrigger,
  TriggerProps,
} from "expo-router/ui";
import React from "react";
import { Pressable, View } from "react-native";

export default function TabLayout() {
  const theme = useTheme();
  const themeMode = useThemeMode();

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
          <TabTrigger name="index" href="/" asChild>
            <TabButton
              focusedIcon="file-tray-full"
              defaultIcon="file-tray-full-outline"
            />
          </TabTrigger>
          <TabTrigger name="shows" href="/shows" asChild>
            <TabButton focusedIcon="layers" defaultIcon="layers-outline" />
          </TabTrigger>
          <TabTrigger name="watchlist" href="/watchlist" asChild>
            <TabButton focusedIcon="albums" defaultIcon="albums-outline" />
          </TabTrigger>
          <TabTrigger name="settings" href="/settings" asChild>
            <TabButton focusedIcon="settings" defaultIcon="settings-outline" />
          </TabTrigger>
        </LinearGradient>
      </TabList>
    </Tabs>
  );
}

type TabButtonProps = Partial<TriggerProps> & {
  defaultIcon: ThemedIconProps["name"];
  focusedIcon: ThemedIconProps["name"];
};

// const TabButton = React.forwardRef<View, TabButtonProps>((props, ref) => {
//   return (
//     <BaseButton
//       px={10}
//       py={5}
//       size="lg"
//       type="primary"
//       opacity={props.isFocused ? 1 : 0.6}
//       icon={{
//         name: props.isFocused ? props.focusedIcon : props.defaultIcon,
//         source: "Ionicons",
//       }}
//       ref={ref}
//       {...props}
//     />
//   );
// });

const TabButton = React.forwardRef<View, TabButtonProps>((props, ref) => {
  return (
    <Pressable
      ref={ref}
      {...props}
      style={{
        padding: 10,
        opacity: props.isFocused ? 1 : 0.6,
      }}
    >
      {props.isFocused && (
        <ThemedIcon name={props.focusedIcon} source="Ionicons" size={"lg"} />
      )}
      {!props.isFocused && (
        <ThemedIcon name={props.defaultIcon} source="Ionicons" size={"lg"} />
      )}
    </Pressable>
  );
});
