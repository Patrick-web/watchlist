import Box from "@/components/reusables/Box";
import ThemedActivityIndicator from "@/components/reusables/ThemedActivityIndicator";
import ThemedButton from "@/components/reusables/ThemedButton";
import ThemedErrorCard from "@/components/reusables/ThemedErrorCard";
import ThemedTextInput from "@/components/reusables/ThemedTextInput";
import ThemedSegmentedPicker from "@/components/reusables/ThemedSegmentedPicker";

import useDebounce from "@/hooks/useDebounce.hook";
import { useTheme } from "@/hooks/useTheme.hook";
import { buildImageUrl, TMDBApiError } from "@/utils/api.utils";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Platform } from "react-native";
import { Image } from "expo-image";
import { FadeInLeft, FadeOutLeft } from "react-native-reanimated";
import Reanimated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { changeCase } from "@/utils/text.utils";
import Empty from "@/components/Empty";
import { POSTER_RATIO, sHeight, sWidth } from "@/constants/dimensions.constant";
import ThemedText from "@/components/reusables/ThemedText";
import useSearch from "@/hooks/useSearch.hook";
import { SearchResponse } from "@/types/tmdb.types";

// Loading skeleton component
const SearchSkeleton = React.memo(() => {
  const theme = useTheme();

  return (
    <Box
      flex={1}
      px={20}
      direction="row"
      wrap="wrap"
      justify="space-evenly"
      gap={10}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Box
          key={index}
          color={theme.surface}
          width={sWidth / 2 - 40}
          height={(sWidth / 2 - 40) * POSTER_RATIO}
          borderRadius={sWidth / 2 - 40}
        ></Box>
      ))}
    </Box>
  );
});

SearchSkeleton.displayName = "SearchSkeleton";

// Search prompt component for empty state
const SearchPrompt = React.memo(() => {
  const theme = useTheme();
  const params = useLocalSearchParams<{ mode: "movies" | "shows" }>();

  return (
    <Box flex={1} justify="center" align="center" px={40}>
      <Box align="center" gap={16}>
        <Box
          width={80}
          height={80}
          radius={40}
          color={theme.surface}
          justify="center"
          align="center"
          mb={8}
        >
          <ThemedText size="xxl" color={theme.onSurface} opacity={0.5}>
            🔍
          </ThemedText>
        </Box>

        <ThemedText
          size="xl"
          style={{ fontWeight: "bold" }}
          color={theme.onSurface}
          align="center"
        >
          {params.mode === "movies"
            ? "Search Movies"
            : params.mode === "shows"
              ? "Search TV Shows"
              : "Search Movies & Shows"}
        </ThemedText>

        <ThemedText
          size="md"
          color={theme.onSurface}
          opacity={0.7}
          align="center"
        >
          {params.mode === "movies"
            ? "Find your favorite movies by title, actor, or keyword"
            : params.mode === "shows"
              ? "Discover TV shows by title, cast, or genre"
              : "Explore thousands of movies and TV shows"}
        </ThemedText>
      </Box>
    </Box>
  );
});

SearchPrompt.displayName = "SearchPrompt";

export default function Search() {
  const params = useLocalSearchParams<{ mode: "movies" | "shows" | "all" }>();

  const theme = useTheme();

  const [query, setQuery] = useState("");
  const [searchMode, setSearchMode] = useState<"movies" | "shows">(
    params.mode === "all" ? "movies" : params.mode || "movies",
  );
  const debouncedQuery = useDebounce(query, 1000);

  const { data, isLoading, isFetching, isFetched, error } = useSearch(
    debouncedQuery,
    {
      type: searchMode === "movies" ? "movie" : "tv",
      page: 1,
      includeAdult: false,
    },
  );

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
      <Box px={20} gap={10}>
        <ThemedTextInput
          placeholder={`Search ${changeCase(searchMode, "sentence")}`}
          size={"xxl"}
          style={{ fontWeight: "bold" }}
          placeholderTextColor={theme.onSurface}
          onChangeText={(text) => {
            setQuery(text.toLowerCase());
          }}
          accessibilityLabel="Search input"
          accessibilityHint={`Search for ${changeCase(searchMode, "sentence")}`}
          ref={inputRef}
          autoFocus
          wrapper={
            Platform.OS === "ios"
              ? {
                  borderWidth: 0,
                  backgroundColor: "transparent",
                  flexGrow: 1,
                }
              : {
                  radius: 40,
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
                  viewProps={{
                    accessibilityLabel: "Go back",
                    accessibilityRole: "button",
                  }}
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
                  viewProps={{
                    accessibilityLabel: "Clear search",
                    accessibilityRole: "button",
                  }}
                  onPress={() => {
                    setQuery("");
                    inputRef.current?.clear();
                  }}
                />
              )}
            </>
          }
        />

        {params.mode === "all" && (
          <Box align="center">
            <ThemedSegmentedPicker
              options={["movies", "shows"] as const}
              selectedValue={searchMode}
              onSelect={({ option }) => setSearchMode(option)}
              getLabel={(option) => changeCase(option, "title")}
              getValue={(option) => option}
              size="md"
              width={200}
            />
          </Box>
        )}
      </Box>
      <SearchResults
        data={data?.results || []}
        isFetching={isFetching}
        isLoading={isLoading}
        isFetched={isFetched}
        error={error}
        searchMode={searchMode}
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
    searchMode,
  }: {
    data: SearchResponse["results"];
    isFetching: boolean;
    isLoading: boolean;
    isFetched: boolean;
    error: any;
    searchMode: "movies" | "shows";
  }) => {
    const insets = useSafeAreaInsets();

    return (
      <>
        {(isLoading || isFetching) && (
          <>
            <ThemedActivityIndicator />
            <SearchSkeleton />
          </>
        )}
        {error && (
          <Box px={20}>
            <ThemedErrorCard
              title={
                error instanceof TMDBApiError
                  ? "API Error"
                  : "Something went wrong"
              }
              error={
                error instanceof TMDBApiError
                  ? `${error.message} ${error.status ? `(${error.status})` : ""}`
                  : error.message || "An unexpected error occurred"
              }
            />
            {error instanceof TMDBApiError && error.status === 401 && (
              <Box mt={10}>
                <ThemedText size="sm" color="#ff0000" align="center">
                  Please check your TMDB API key configuration
                </ThemedText>
              </Box>
            )}
          </Box>
        )}
        <Box flex={1}>
          <Reanimated.FlatList
            data={data || []}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={{
              alignItems: "center",
              justifyContent: data.length > 0 ? "center" : "flex-start",
              columnGap: 20,
            }}
            ItemSeparatorComponent={() => <Box height={20} />}
            renderItem={({ item }) => (
              <ThemedButton
                type="text"
                align="center"
                alignSelf="center"
                viewProps={{
                  accessibilityHint: "Double tap to open show details",
                  accessibilityRole: "button",
                }}
                onPress={() => {
                  const path =
                    searchMode === "movies"
                      ? `/movie/${item.id.toString()}`
                      : `/tv/${item.id.toString()}`;
                  router.push({
                    pathname: path as any,
                    params: { preview: JSON.stringify(item) },
                  });
                }}
              >
                <Image
                  source={buildImageUrl(item.poster_path)}
                  style={{
                    width: sWidth / 2 - 40,
                    height: (sWidth / 2 - 40) * POSTER_RATIO,
                    borderRadius: sWidth / 2 - 40,
                  }}
                  contentFit="cover"
                />
              </ThemedButton>
            )}
            ListEmptyComponent={
              isFetched ? <Empty message="No results found" /> : <></>
            }
            entering={FadeInLeft.springify().stiffness(200).damping(80)}
            exiting={FadeOutLeft.springify().stiffness(200).damping(80)}
            contentContainerStyle={{
              flex: data.length > 0 ? 0 : 1,
              paddingHorizontal: 20,
            }}
            contentInset={{ bottom: insets.bottom }}
          />
        </Box>
      </>
    );
  },
);

SearchResults.displayName = "SearchResults";
