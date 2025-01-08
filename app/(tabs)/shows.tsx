import AppHeader from "@/components/AppHeader";
import Empty from "@/components/Empty";
import Box from "@/components/reusables/Box";
import Page from "@/components/reusables/Page";
import ThemedButton from "@/components/reusables/ThemedButton";
import ThemedText from "@/components/reusables/ThemedText";
import SubscribedShow from "@/components/SubscribedShow";
import { useTheme } from "@/hooks/useTheme.hook";
import { PERSISTED_APP_STATE } from "@/valitio.store";
import { router } from "expo-router";
import { Platform } from "react-native";
import Reanimated, { LinearTransition } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSnapshot } from "valtio";

export default function Shows() {
  const APP_STATE = useSnapshot(PERSISTED_APP_STATE);
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  return (
    <Page>
      <AppHeader title="Subscribed Shows">
        <ThemedButton
          label={"Add"}
          type="surface"
          icon={{
            name: "add",
            source: "Ionicons",
            position: "append",
          }}
          width={100}
          size="sm"
          onPress={() => {
            router.push({
              pathname: "/search",
              params: {
                mode: "shows",
              },
            });
          }}
        />
      </AppHeader>
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
          ListEmptyComponent={
            <Empty message="You haven't subscribed to any shows yet">
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
            </Empty>
          }
          contentInset={{ bottom: insets.bottom }}
        />
      </Box>
    </Page>
  );
}
