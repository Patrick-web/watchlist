import Box from "@/components/reusables/Box";
import Page from "@/components/reusables/Page";
import ThemedText from "@/components/reusables/ThemedText";
import { Platform } from "react-native";
import Reanimated, {
  FadeInLeft,
  FadeInRight,
  FadeOutLeft,
  FadeOutRight,
  LinearTransition,
} from "react-native-reanimated";
import { useEffect, useState } from "react";
import { PERSISTED_APP_STATE } from "@/valitio.store";
import { useSnapshot } from "valtio";
import { useTheme, useThemeMode } from "@/hooks/useTheme.hook";
import ThemedButton from "@/components/reusables/ThemedButton";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import EmptyWatchlist from "@/components/EmptyWatchlist";
import ShowCard from "@/components/ShowCard";
import MovieCard from "@/components/MovieCard";
import { sWidth } from "@/constants/dimensions.constant";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Watchlist() {
  const APP_STATE = useSnapshot(PERSISTED_APP_STATE);

  const theme = useTheme();
  const themeMode = useThemeMode();

  const [view, setView] = useState<"shows" | "movies">("shows");

  const insets = useSafeAreaInsets();

  // useEffect(() => {
  //   if (
  //     APP_STATE.watchList.movies.length > 0 &&
  //     APP_STATE.watchList.shows.length === 0
  //   ) {
  //     setView("movies");
  //   }
  // }, []);

  return (
    <Page>
      <Box pb={10} direction="row" justify="space-between" align="center">
        <ThemedText size={"xl"} fontWeight="bold">
          Want To Watch
        </ThemedText>
        <ThemedButton
          label={"Add"}
          type="surface"
          icon={{
            name: "add",
            source: "Ionicons",
            position: "append",
          }}
          size="sm"
          width={140}
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

      <Box
        direction="row"
        pa={5}
        radius={20}
        color={theme.lightBackground}
        mx={"auto"}
      >
        <ThemedButton
          label={"Shows"}
          onPress={() => setView("shows")}
          size="xxs"
          type={"text"}
          labelProps={{
            color: view === "shows" ? theme.text : theme.onSurface,
          }}
        />
        <ThemedButton
          label={"Movies"}
          onPress={() => {
            setView("movies");
          }}
          size="xxs"
          type={"text"}
          labelProps={{
            color: view === "movies" ? theme.text : theme.onSurface,
          }}
        />
      </Box>

      <Box flex={1}>
        {view === "shows" && (
          <Reanimated.FlatList
            data={APP_STATE.watchList.shows}
            keyExtractor={(item) => item.url}
            style={{ flex: 1 }}
            ListEmptyComponent={
              <EmptyWatchlist title="No shows in your watchlist" />
            }
            renderItem={({ item }) => <ShowCard show={item} />}
            itemLayoutAnimation={LinearTransition}
            ItemSeparatorComponent={() => <Box height={40} />}
            entering={FadeInLeft.springify().stiffness(200).damping(80)}
            exiting={FadeOutLeft.springify().stiffness(200).damping(80)}
            contentContainerStyle={{
              flex: 1,
            }}
          />
        )}
        {view === "movies" && (
          <Reanimated.FlatList
            data={APP_STATE.watchList.movies}
            keyExtractor={(item) => item.url}
            style={{ flex: 1 }}
            ListEmptyComponent={
              <EmptyWatchlist title="No movies in your watchlist" />
            }
            contentContainerStyle={{
              flex: 1,
            }}
            renderItem={({ item }) => <MovieCard movie={item} />}
            itemLayoutAnimation={LinearTransition}
            ItemSeparatorComponent={() => <Box height={40} />}
            entering={FadeInRight.springify().stiffness(200).damping(80)}
            exiting={FadeOutRight.springify().stiffness(200).damping(80)}
          />
        )}
      </Box>
    </Page>
  );
}
