import NewEpisodeCard from "@/components/NewEpisodeCard";
import Box, { AnimatedBox } from "@/components/reusables/Box";
import Page from "@/components/reusables/Page";
import ThemedText from "@/components/reusables/ThemedText";
import { useQuery } from "@tanstack/react-query";
import Reanimated, {
  FadeInDown,
  FadeOutDown,
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
import { RefreshControl } from "react-native";
import { sWidth } from "@/constants/dimensions.constant";

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

  async function testApiRequest() {
    // json place holder
    console.log("testApiRequest");
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    console.log({ data });
  }

  useEffect(() => {
    registerBackgroundFetchAsync();
    testApiRequest();
  }, []);
  return (
    <Page>
      <Box pb={10} direction="row" justify="space-between" align="center">
        <AnimatedBox
          viewProps={{
            layout: LinearTransition,
          }}
        >
          <ThemedText size={"xl"} fontWeight="bold">
            New Episodes
          </ThemedText>
          {(isFetching || isLoading) && (
            <AnimatedBox
              viewProps={{
                entering: FadeInDown,
                exiting: FadeOutDown,
              }}
            >
              <ThemedText size="xs" fontWeight="light" color="onSurface">
                Finding for new episodes...
              </ThemedText>
            </AnimatedBox>
          )}
        </AnimatedBox>
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
        refreshControl={
          // custom refresh control that uses the refetch function
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor={theme.primary}
          />
        }
        contentContainerStyle={{
          flex: APP_STATE.newEpisodes.length > 0 ? 0 : 1,
        }}
        contentInset={{ bottom: 80 }}
        // 2 column layout on larger screens and 1 column on smaller screens
        numColumns={sWidth > 600 ? 2 : 1}
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
                      mode: "shows",
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
