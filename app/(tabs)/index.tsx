import NewEpisodeCard from "@/components/NewEpisodeCard";
import Box from "@/components/reusables/Box";
import Page from "@/components/reusables/Page";
import * as Notifications from "expo-notifications";
import ThemedText from "@/components/reusables/ThemedText";
import { extractShows, F_HEADERS, ShowInfo } from "@/lib/scrape";
import {
  showsWithNewEpisodesAtom,
  subscribedShowsAtom,
} from "@/stores/atoms/subs.atom";
import { useAtom } from "jotai";
import { RefreshControl } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/hooks/useTheme.hook";
import Reanimated, { LinearTransition } from "react-native-reanimated";
import { useNetworkState } from "expo-network";
import EmptySubscriptions from "@/components/EmptySubscriptions";
import EmptyNewEpisodes from "@/components/EmptyNewEpisodes";
import { useEffect } from "react";
import { PERSISTED_APP_STATE } from "@/valitio.store";
import { useSnapshot } from "valtio";
import { findNewEpisodes } from "@/lib/refresh";

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
    console.log({ APP_STATE });
  }, []);
  return (
    <Page>
      <Box pb={10}>
        <ThemedText size={"xxl"} fontWeight="bold">
          NEW EPISODES
        </ThemedText>
      </Box>
      {/* <BackgroundFetchScreen /> */}
      <Reanimated.FlatList
        refreshControl={
          <RefreshControl
            refreshing={isFetching || isLoading}
            onRefresh={() => refetch()}
          />
        }
        contentContainerStyle={{
          flex: APP_STATE.showsWithNewEpisodes.length > 0 ? 0 : 1,
        }}
        contentInset={{ bottom: 80 }}
        data={APP_STATE.showsWithNewEpisodes}
        keyExtractor={(item) => item.url}
        renderItem={({ item }) => <NewEpisodeCard episode={item} />}
        style={{ flex: 1 }}
        itemLayoutAnimation={LinearTransition}
        ItemSeparatorComponent={() => <Box height={40} />}
        ListEmptyComponent={() =>
          APP_STATE.subscribedShows.length === 0 ? (
            <EmptySubscriptions />
          ) : APP_STATE.showsWithNewEpisodes.length === 0 ? (
            <EmptyNewEpisodes />
          ) : (
            <></>
          )
        }
      />
    </Page>
  );
}
