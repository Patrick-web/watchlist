import NewEpisodeCard from "@/components/NewEpisodeCard";
import Box, { AnimatedBox } from "@/components/reusables/Box";
import Page from "@/components/reusables/Page";
import ThemedText from "@/components/reusables/ThemedText";
import { useQuery } from "@tanstack/react-query";
import Reanimated, {
  FadeInUp,
  FadeOutUp,
  LinearTransition,
} from "react-native-reanimated";
import { useEffect } from "react";
import { PERSISTED_APP_STATE } from "@/valitio.store";
import { useSnapshot } from "valtio";
import { findNewEpisodes } from "@/lib/refresh";
import { registerBackgroundFetchAsync } from "@/lib/backgroundTasks";
import { useTheme } from "@/hooks/useTheme.hook";
import ThemedButton from "@/components/reusables/ThemedButton";
import { router } from "expo-router";
import Empty from "@/components/Empty";

export default function HomeScreen() {
  const APP_STATE = useSnapshot(PERSISTED_APP_STATE);
  const { refetch, isLoading, isFetching } = useQuery({
    queryKey: ["refresh", new Date().getDay()],
    queryFn: async () => {
      await findNewEpisodes();
      return true;
    },
    enabled: APP_STATE.subscribedShows.length > 0 ? true : false,
    retry: false,
  });

  const theme = useTheme();

  useEffect(() => {
    // decreaseEpisode();
    registerBackgroundFetchAsync();
  }, []);
  return (
    <Page>
      <Box pb={10} direction="row" justify="space-between" align="center">
        <Box>
          <ThemedText size={"xl"} fontWeight="bold">
            New Episodes
          </ThemedText>
          {(isFetching || isLoading) && (
            <AnimatedBox
              viewProps={{
                entering: FadeInUp,
                exiting: FadeOutUp,
              }}
            >
              <ThemedText size="xs" fontWeight="light" color="onSurface">
                Finding for new episodes...
              </ThemedText>
            </AnimatedBox>
          )}
        </Box>
        <ThemedButton
          label={"Search"}
          type="surface"
          icon={{
            name: "search",
            position: "append",
          }}
          width={140}
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
      <Reanimated.FlatList
        // refreshControl={
        //   <RefreshControl
        //     refreshing={isFetching || isLoading}
        //     onRefresh={() => refetch()}
        //   />
        // }
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
            <Empty message="You haven't subscribed to any shows yet">
              <ThemedButton
                label={"Add Some"}
                width={"80%"}
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
            </Empty>
          ) : APP_STATE.newEpisodes.length === 0 ? (
            <Empty message="No new episodes yet" />
          ) : (
            <></>
          )
        }
      />
    </Page>
  );
}
