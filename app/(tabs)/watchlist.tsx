import Box from "@/components/reusables/Box";
import Page from "@/components/reusables/Page";
import ThemedButton from "@/components/reusables/ThemedButton";
import ThemedIcon from "@/components/reusables/ThemedIcon";
import ThemedText from "@/components/reusables/ThemedText";
import SubscribedShow from "@/components/SubscribedShow";
import { useTheme } from "@/hooks/useTheme.hook";
import { PERSISTED_APP_STATE } from "@/valitio.store";
import { router } from "expo-router";
import Reanimated, { LinearTransition } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSnapshot } from "valtio";

export default function Shows() {
  const APP_STATE = useSnapshot(PERSISTED_APP_STATE);
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  return (
    <Page>
      <Box>
        <ThemedText size={"xxl"} fontWeight="bold">
          WATCHLIST
        </ThemedText>
      </Box>
      <Box flex={1}>
        <Reanimated.FlatList
          data={APP_STATE.subscribedShows}
          keyExtractor={(item) => item.url}
          renderItem={({ item }) => <SubscribedShow show={item} />}
          ItemSeparatorComponent={() => <Box height={20} />}
          numColumns={2}
          columnWrapperStyle={{
            alignItems: "center",
            justifyContent:
              APP_STATE.subscribedShows.length > 1 ? "center" : "flex-start",
            columnGap: 20,
          }}
          contentContainerStyle={{
            flex: APP_STATE.subscribedShows.length > 0 ? 0 : 1,
          }}
          contentInset={{ bottom: 80 }}
          ListEmptyComponent={
            <Box
              align="center"
              gap={10}
              color={theme.surface}
              pa={20}
              radius={80}
              block
              ma={"auto"}
            >
              <Box align="center" gap={5}>
                <ThemedIcon
                  name="video-vintage"
                  source="MaterialCommunityIcons"
                />
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
          }
        />
      </Box>
    </Page>
  );
}
