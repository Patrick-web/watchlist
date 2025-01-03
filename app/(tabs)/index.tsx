import NewEpisodeCard from "@/components/NewEpisodeCard";
import Box from "@/components/reusables/Box";
import Page from "@/components/reusables/Page";
import ThemedText from "@/components/reusables/ThemedText";
import { Platform, RefreshControl } from "react-native";
import { useQuery } from "@tanstack/react-query";
import Reanimated, { LinearTransition } from "react-native-reanimated";
import EmptySubscriptions from "@/components/EmptySubscriptions";
import EmptyNewEpisodes from "@/components/EmptyNewEpisodes";
import { useEffect } from "react";
import { PERSISTED_APP_STATE } from "@/valitio.store";
import { useSnapshot } from "valtio";
import { findNewEpisodes } from "@/lib/refresh";
import { registerBackgroundFetchAsync } from "@/lib/backgroundTasks";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemedTextInput from "@/components/reusables/ThemedTextInput";
import { useTheme } from "@/hooks/useTheme.hook";
import ThemedIcon from "@/components/reusables/ThemedIcon";
import ThemedButton from "@/components/reusables/ThemedButton";
import { Route } from "expo-router/build/Route";
import { router } from "expo-router";

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

  const theme = useTheme();

  useEffect(() => {
    registerBackgroundFetchAsync();
  }, []);
  return (
    <Page>
      <Box pb={10} direction="row" justify="space-between" align="center">
        <ThemedText size={"xxxl"} fontWeight="bold">
          NEW EPISODES
        </ThemedText>
        <ThemedButton
          label={"Search"}
          type="surface"
          icon={{
            name: "search",
            position: "append",
          }}
          flex={Platform.OS === "ios" ? 0.6 : 0.7}
          onPress={() => {
            router.push("/search");
          }}
        />
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
