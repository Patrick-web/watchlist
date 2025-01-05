import { useTheme } from "@/hooks/useTheme.hook";
import Box from "./reusables/Box";
import ThemedText from "./reusables/ThemedText";
import ThemedIcon from "./reusables/ThemedIcon";

export default function EmptySearchResults() {
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
      <ThemedIcon name="wind" source="Fontisto" />
      <ThemedText size="sm">No results found</ThemedText>
    </Box>
  );
}
