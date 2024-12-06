import { useTheme } from "@/hooks/useTheme.hook";
import { router } from "expo-router";
import Box from "./reusables/Box";
import ThemedButton from "./reusables/ThemedButton";
import ThemedIcon from "./reusables/ThemedIcon";
import ThemedText from "./reusables/ThemedText";

export default function EmptyNewEpisodes() {
  const theme = useTheme();
  return (
    <Box
      align="center"
      gap={5}
      color={theme.surface}
      pa={20}
      radius={60}
      ma={"auto"}
    >
      <ThemedIcon name="filmstrip-off" source="MaterialCommunityIcons" />
      <ThemedText fontWeight="light">No new episodes yet</ThemedText>
    </Box>
  );
}
