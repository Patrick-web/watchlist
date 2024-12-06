import { useTheme } from "@/hooks/useTheme.hook";
import { router } from "expo-router";
import Box from "./reusables/Box";
import ThemedButton from "./reusables/ThemedButton";
import ThemedIcon from "./reusables/ThemedIcon";
import ThemedText from "./reusables/ThemedText";

export default function EmptySubscriptions() {
  const theme = useTheme();
  return (
    <Box
      align="center"
      gap={10}
      color={theme.surface}
      pa={20}
      radius={80}
      ma={"auto"}
    >
      <Box align="center" gap={5}>
        <ThemedIcon name="video-vintage" source="MaterialCommunityIcons" />
        <ThemedText fontWeight="light">
          You are not watching any shows
        </ThemedText>
      </Box>
      <ThemedButton
        label={"Add Some"}
        icon={{
          name: "search",
          position: "append",
        }}
        size="xs"
        type="secondary"
        onPress={() => {
          router.push("/search");
        }}
      />
    </Box>
  );
}
