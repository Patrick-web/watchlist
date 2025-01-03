import MovieResult from "@/components/MovieResult";
import Box, { AnimatedBox } from "@/components/reusables/Box";
import ThemedActivityIndicator from "@/components/reusables/ThemedActivityIndicator";
import ThemedButton from "@/components/reusables/ThemedButton";
import ThemedErrorCard from "@/components/reusables/ThemedErrorCard";
import ThemedTextInput from "@/components/reusables/ThemedTextInput";
import ShowResult from "@/components/ShowResult";
import useDebounce from "@/hooks/useDebounce.hook";
import useSearch from "@/hooks/useSearchShows.hook";
import { useTheme, useThemeMode } from "@/hooks/useTheme.hook";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import {
  FadeInLeft,
  FadeInRight,
  FadeOutLeft,
  FadeOutRight,
  LinearTransition,
} from "react-native-reanimated";
import { LegendList } from "@legendapp/list";
import { sHeight } from "@/constants/dimensions.constant";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { changeCase } from "@/utils/text.utils";
import { LinearGradient } from "expo-linear-gradient";
import EmptySearchResults from "@/components/EmptySearchResults";

export default function Search() {
  const params = useLocalSearchParams<{ mode: "movies" | "shows" | "all" }>();

  const theme = useTheme();
  const themeMode = useThemeMode();

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 1000);

  const { data, isLoading, isFetching, isFetched, error } =
    useSearch(debouncedQuery);

  const [view, setView] = useState<"shows" | "movies">("shows");

  const insets = useSafeAreaInsets();
  const yInsets = insets.bottom + insets.top;

  useEffect(() => {
    if (data && data.movies.length > 0 && data.shows.length === 0) {
      setView("movies");
    }
  }, [data]);

  return (
    <>
      <Box height={sHeight - yInsets} block pa={20}>
        <ThemedTextInput
          placeholder={
            params.mode != "all"
              ? `Search ${changeCase(params.mode, "sentence")}`
              : "Search Shows & Movies"
          }
          size={30}
          style={{ fontWeight: "bold" }}
          placeholderTextColor={theme.onSurface}
          onChangeText={(text) => {
            setQuery(text.toLowerCase());
          }}
          autoFocus
          wrapper={{
            borderWidth: 0,
            backgroundColor: "transparent",
            flexGrow: 1,
          }}
          leftSlot={
            <>
              {Platform.OS !== "ios" && false && (
                <ThemedButton
                  icon={{ name: "arrow-left" }}
                  type="surface"
                  size="xs"
                  mr={10}
                  onPress={() => {
                    router.back();
                  }}
                />
              )}
            </>
          }
        />
        {(isLoading || isFetching) && <ThemedActivityIndicator />}
        {error && (
          <ThemedErrorCard title="Something went wrong" error={error.message} />
        )}
        <Box>
          {view === "shows" && (
            <AnimatedBox
              viewProps={{
                entering: FadeInLeft.springify().stiffness(200).damping(80),
                exiting: FadeOutLeft.springify().stiffness(200).damping(80),
              }}
              height={"95%"}
            >
              <LegendList
                data={data.shows}
                keyExtractor={(item) => item.url}
                estimatedItemSize={10}
                ItemSeparatorComponent={() => <Box height={20} />}
                renderItem={({ item }) => <ShowResult show={item} />}
                ListEmptyComponent={isFetched ? <EmptySearchResults /> : <></>}
              />
            </AnimatedBox>
          )}
          {view === "movies" && (
            <AnimatedBox
              viewProps={{
                entering: FadeInRight.springify().stiffness(200).damping(80),
                exiting: FadeOutRight.springify().stiffness(200).damping(80),
              }}
              height={"95%"}
            >
              <LegendList
                data={data.movies}
                keyExtractor={(item) => item.url}
                estimatedItemSize={10}
                ItemSeparatorComponent={() => <Box height={20} />}
                renderItem={({ item }) => <MovieResult movie={item} />}
                ListEmptyComponent={isFetched ? <EmptySearchResults /> : <></>}
              />
            </AnimatedBox>
          )}
        </Box>
      </Box>

      {params.mode === "all" && (
        <LinearGradient
          colors={[
            themeMode === "dark" ? "rgba(32,32,32,0)" : "rgba(255,255,255,0)",
            theme.background,
            theme.background,
          ]}
          style={{
            position: "absolute",
            bottom: 0,
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
            flexDirection={
              data && data.movies.length > 0 && data.shows.length === 0
                ? "row-reverse"
                : "row"
            }
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
      )}
    </>
  );
}
