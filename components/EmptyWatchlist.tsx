import { useTheme } from "@/hooks/useTheme.hook";
import { router } from "expo-router";
import Box from "./reusables/Box";
import ThemedButton from "./reusables/ThemedButton";
import ThemedIcon from "./reusables/ThemedIcon";
import ThemedText from "./reusables/ThemedText";

export default function EmptyWatchlist() {
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
        <ThemedIcon name="video-vintage" source="MaterialCommunityIcons" />
        <ThemedText fontWeight="light">Your watchlist is empty</ThemedText>
      </Box>
      <ThemedButton
        label={"Add Stuff to Watch Later"}
        icon={{
          name: "plus",
          position: "append",
        }}
        type="primary"
        size="sm"
        onPress={() => {
          router.push({
            pathname: "/search",
            params: {
              mode: "all",
            },
          });
        }}
      />
    </Box>
  );
}
