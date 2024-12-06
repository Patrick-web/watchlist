import Box from "@/components/reusables/Box";
import Page from "@/components/reusables/Page";
import ThemedActivityIndicator from "@/components/reusables/ThemedActivityIndicator";
import ThemedButton from "@/components/reusables/ThemedButton";
import ThemedErrorCard from "@/components/reusables/ThemedErrorCard";
import ThemedTextInput from "@/components/reusables/ThemedTextInput";
import ShowCard from "@/components/ShowCard";
import useDebounce from "@/hooks/useDebounce.hook";
import useSearchShows from "@/hooks/useSearchShows.hook";
import { useTheme } from "@/hooks/useTheme.hook";
import { router } from "expo-router";
import { Route } from "expo-router/build/Route";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

export default function Search() {
  const theme = useTheme();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 1000);

  const {
    data: shows,
    isLoading,
    isFetching,
    error,
  } = useSearchShows(debouncedQuery);

  return (
    <Box height={"100%"} block pt={Platform.OS === "ios" ? 0 : 20}>
      <ThemedTextInput
        placeholder="Search Shows"
        size={"xxxl"}
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
            {Platform.OS !== "ios" && (
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
      <Box gap={10} px={20}>
        {shows.map((show) => (
          <ShowCard show={show} key={show.url} />
        ))}
      </Box>
    </Box>
  );
}
