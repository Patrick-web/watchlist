import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        presentation: "formSheet",
        headerShown: false,
      }}
    />
  );
}
