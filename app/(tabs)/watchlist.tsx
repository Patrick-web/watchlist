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

export default function Watchlist() {
  const APP_STATE = useSnapshot(PERSISTED_APP_STATE);

  const theme = useTheme();
  const themeMode = useThemeMode();

  const [view, setView] = useState<"shows" | "movies">("shows");

  useEffect(() => {
    if (
      APP_STATE.watchList.movies.length > 0 &&
      APP_STATE.watchList.shows.length === 0
    ) {
      setView("movies");
    }
  }, []);

  return (
    <Page>
      <Box pb={10} direction="row" justify="space-between" align="center">
        <ThemedText size={"xxxl"} fontWeight="bold">
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
          flex={Platform.OS === "ios" ? 0.7 : 0.7}
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

      <Box flex={1}>
        {view === "shows" && (
          <Reanimated.FlatList
            data={APP_STATE.watchList.shows}
            keyExtractor={(item) => item.url}
            style={{ flex: 1 }}
            ListEmptyComponent={<EmptyWatchlist />}
            renderItem={({ item }) => <ShowCard show={item} />}
            itemLayoutAnimation={LinearTransition}
            ItemSeparatorComponent={() => <Box height={40} />}
            entering={FadeInLeft.springify().stiffness(200).damping(80)}
            exiting={FadeOutLeft.springify().stiffness(200).damping(80)}
          />
        )}
        {view === "movies" && (
          <Reanimated.FlatList
            data={APP_STATE.watchList.movies}
            keyExtractor={(item) => item.url}
            style={{ flex: 1 }}
            ListEmptyComponent={<EmptyWatchlist />}
            renderItem={({ item }) => <MovieCard movie={item} />}
            itemLayoutAnimation={LinearTransition}
            ItemSeparatorComponent={() => <Box height={40} />}
            entering={FadeInRight.springify().stiffness(200).damping(80)}
            exiting={FadeOutRight.springify().stiffness(200).damping(80)}
          />
        )}
      </Box>

      <LinearGradient
        colors={[
          themeMode === "dark" ? "rgba(32,32,32,0)" : "rgba(255,255,255,0)",
          theme.background,
          theme.background,
        ]}
        style={{
          position: "absolute",
          bottom: 10,
          paddingTop: 20,
          paddingBottom: 20,
          width: "100%",
          height: 80,
          transform: [
            {
              translateY: -10,
            },
          ],
          flexDirection: "row",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <Box
          direction="row"
          pa={5}
          radius={20}
          color={theme.surface}
          mx={"auto"}
        >
          <ThemedButton
            label={"Shows"}
            onPress={() => setView("shows")}
            viewProps={{ layout: LinearTransition }}
            size="xxs"
            type={view === "shows" ? "secondary" : "surface"}
          />
          <ThemedButton
            label={"Movies"}
            onPress={() => {
              setView("movies");
            }}
            viewProps={{ layout: LinearTransition }}
            size="xxs"
            type={view === "movies" ? "secondary" : "surface"}
          />
        </Box>
      </LinearGradient>
    </Page>
  );
}
