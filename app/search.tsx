import Box from "@/components/reusables/Box";
import ThemedActivityIndicator from "@/components/reusables/ThemedActivityIndicator";
import ThemedButton from "@/components/reusables/ThemedButton";
import ThemedErrorCard from "@/components/reusables/ThemedErrorCard";
import ThemedTextInput from "@/components/reusables/ThemedTextInput";

import useDebounce from "@/hooks/useDebounce.hook";
import useSearch from "@/hooks/useSearchShows.hook";
import { useTheme } from "@/hooks/useTheme.hook";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Platform } from "react-native";
import { Image } from "expo-image";
import {
  FadeInLeft,
  FadeInRight,
  FadeOutLeft,
  FadeOutRight,
  LinearTransition,
} from "react-native-reanimated";
import Reanimated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { changeCase } from "@/utils/text.utils";
import { FilmResult, MovieResult } from "@/types";
import Empty from "@/components/Empty";
import { POSTER_RATIO, sHeight, sWidth } from "@/constants/dimensions.constant";
import Movie from "@/components/Movie";

export default function Search() {
  const params = useLocalSearchParams<{ mode: "movies" | "shows" | "all" }>();

  const theme = useTheme();

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 1000);

  const { data, isLoading, isFetching, isFetched, error } =
    useSearch(debouncedQuery);

  const insets = useSafeAreaInsets();

  const inputRef = React.useRef<any>();

  return (
    <Box
      pt={Platform.OS === "ios" ? 0 : insets.top}
      height={sHeight - insets.bottom - insets.top}
      justify="space-between"
      color={"background"}
      gap={10}
    >
      <ThemedTextInput
        placeholder={
          params.mode !== "all"
            ? `Search ${changeCase(params.mode, "sentence")}`
            : "Search Shows & Movies"
        }
        size={"xxl"}
        style={{ fontWeight: "bold" }}
        placeholderTextColor={theme.onSurface}
        onChangeText={(text) => {
          setQuery(text.toLowerCase());
        }}
        ref={inputRef}
        autoFocus
        wrapper={
          Platform.OS === "ios"
            ? {
                borderWidth: 0,
                backgroundColor: "transparent",
                flexGrow: 1,
                pl: 20,
              }
            : {
                radius: 40,
                mx: 20,
              }
        }
        leftSlot={
          <>
            {Platform.OS === "android" && (
              <ThemedButton
                icon={{ name: "arrow-back", source: "Ionicons" }}
                type="text"
                size="xs"
                px={10}
                onPress={() => {
                  router.back();
                }}
              />
            )}
          </>
        }
        // right slot that clears the search query
        rightSlot={
          <>
            {query.length > 0 && (
              <ThemedButton
                icon={{ name: "close", source: "Ionicons" }}
                type="text"
                size="xs"
                px={10}
                onPress={() => {
                  inputRef.current?.clear();
                }}
              />
            )}
          </>
        }
      />
      <SearchResults
        data={data}
        isFetching={isFetching}
        isLoading={isLoading}
        isFetched={isFetched}
        error={error}
      />
    </Box>
  );
}

const SearchResults = React.memo(
  ({
    data,
    isFetching,
    isLoading,
    isFetched,
    error,
  }: {
    data: {
      shows: FilmResult[];
      movies: FilmResult<MovieResult>[];
    };
    isFetching: boolean;
    isLoading: boolean;
    isFetched: boolean;
    error: any;
  }) => {
    const [view, setView] = useState<"shows" | "movies">("shows");
    const params = useLocalSearchParams<{ mode: "movies" | "shows" | "all" }>();

    const theme = useTheme();
    const insets = useSafeAreaInsets();
    return (
      <>
        {params.mode === "all" && (
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
        )}
        {(isLoading || isFetching) && <ThemedActivityIndicator />}
        {error && (
          <ThemedErrorCard title="Something went wrong" error={error.message} />
        )}
        <Box flex={1}>
          {view === "shows" && (
            <Reanimated.FlatList
              data={data.shows}
              keyExtractor={(item) => item.url}
              numColumns={2}
              columnWrapperStyle={{
                alignItems: "center",
                justifyContent: data.shows.length > 0 ? "center" : "flex-start",
                columnGap: 20,
              }}
              ItemSeparatorComponent={() => <Box height={20} />}
              renderItem={({ item: show }) => (
                <ThemedButton
                  type="text"
                  align="center"
                  alignSelf="center"
                  onPress={() => {
                    router.push({
                      pathname: `/show-details`,
                      params: { film: JSON.stringify(show) },
                    });
                  }}
                >
                  <Image
                    source={show.poster}
                    style={{
                      width: sWidth / 2 - 40,
                      height: (sWidth / 2 - 40) * POSTER_RATIO,
                      borderRadius: sWidth / 2,
                    }}
                  />
                </ThemedButton>
              )}
              ListEmptyComponent={
                isFetched ? <Empty message="No shows found" /> : <></>
              }
              entering={FadeInLeft.springify().stiffness(200).damping(80)}
              exiting={FadeOutLeft.springify().stiffness(200).damping(80)}
              contentContainerStyle={{
                flex: data.shows.length > 0 ? 0 : 1,
                paddingHorizontal: 20,
              }}
              contentInset={{ bottom: insets.bottom }}
            />
          )}
          {view === "movies" && (
            <Reanimated.FlatList
              data={data.movies}
              keyExtractor={(item) => item.url}
              renderItem={({ item: movie }) => (
                <ThemedButton
                  type="text"
                  block
                  onPress={() => {
                    router.push({
                      pathname: `/movie-details`,
                      params: { film: JSON.stringify(movie) },
                    });
                  }}
                >
                  <Movie movie={movie} />
                </ThemedButton>
              )}
              ItemSeparatorComponent={() => <Box height={20} />}
              ListEmptyComponent={
                isFetched ? <Empty message="No movies found" /> : <></>
              }
              entering={FadeInRight.springify().stiffness(200).damping(80)}
              exiting={FadeOutRight.springify().stiffness(200).damping(80)}
              contentContainerStyle={{
                flex: data.shows.length > 0 ? 0 : 1,
                paddingHorizontal: 20,
              }}
              contentInset={{ bottom: insets.bottom }}
            />
          )}
        </Box>
      </>
    );
  },
);

SearchResults.displayName = "SearchResults";
