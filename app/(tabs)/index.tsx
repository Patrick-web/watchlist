import NewEpisodeCard from "@/components/NewEpisodeCard";
import Box from "@/components/reusables/Box";
import Page from "@/components/reusables/Page";
import ThemedText from "@/components/reusables/ThemedText";
import { RefreshControl } from "react-native";
import { useQuery } from "@tanstack/react-query";
import Reanimated, { LinearTransition } from "react-native-reanimated";
import EmptySubscriptions from "@/components/EmptySubscriptions";
import EmptyNewEpisodes from "@/components/EmptyNewEpisodes";
import { useEffect } from "react";
import { PERSISTED_APP_STATE } from "@/valitio.store";
import { useSnapshot } from "valtio";
import { findNewEpisodes } from "@/lib/refresh";
import { registerBackgroundFetchAsync } from "@/lib/backgroundTasks";

export default function HomeScreen() {
  const APP_STATE = useSnapshot(PERSISTED_APP_STATE);

  const { refetch, isLoading, isFetching } = useQuery({
    queryKey: ["refresh", new Date().getDay()],
    queryFn: async () => {
      await findNewEpisodes();
      return true;
    },
    enabled: APP_STATE.subscribedShows.length > 0 ? true : false,
  });

  useEffect(() => {
    registerBackgroundFetchAsync();
  }, []);
  return (
    <Page>
      <Box pb={10}>
        <ThemedText size={"xxl"} fontWeight="bold">
          NEW EPISODES
        </ThemedText>
      </Box>
      <Reanimated.FlatList
        refreshControl={
          <RefreshControl
            refreshing={isFetching || isLoading}
            onRefresh={() => refetch()}
          />
        }
        contentContainerStyle={{
          flex: APP_STATE.newEpisodes.length > 0 ? 0 : 1,
        }}
        contentInset={{ bottom: 80 }}
        data={APP_STATE.newEpisodes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NewEpisodeCard episode={item} />}
        style={{ flex: 1 }}
        itemLayoutAnimation={LinearTransition}
        ItemSeparatorComponent={() => <Box height={40} />}
        ListEmptyComponent={() =>
          APP_STATE.subscribedShows.length === 0 ? (
            <EmptySubscriptions />
          ) : APP_STATE.newEpisodes.length === 0 ? (
            <EmptyNewEpisodes />
          ) : (
            <></>
          )
        }
      />
    </Page>
  );
}
