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
      my={"auto"}
    >
      <Box align="center" gap={5}>
        <ThemedIcon name="wind" source="Fontisto" />
        <ThemedText fontWeight="light">
          You haven't subscribed to any shows yet
        </ThemedText>
      </Box>
      <ThemedButton
        label={"Add Some"}
        icon={{
          name: "plus",
          position: "append",
        }}
        type="primary"
        size="sm"
        onPress={() => {
          router.push("/search");
        }}
      />
    </Box>
  );
}
