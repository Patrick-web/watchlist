import Box from "@/components/reusables/Box";
import Page from "@/components/reusables/Page";
import ThemedActivityIndicator from "@/components/reusables/ThemedActivityIndicator";
import ThemedErrorCard from "@/components/reusables/ThemedErrorCard";
import ThemedTextInput from "@/components/reusables/ThemedTextInput";
import ShowCard from "@/components/ShowCard";
import useDebounce from "@/hooks/useDebounce.hook";
import useSearchShows from "@/hooks/useSearchShows.hook";
import { useTheme } from "@/hooks/useTheme.hook";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    if (debouncedQuery) {
      console.log("Debounced value:", debouncedQuery);
      // Handle the debounced input value (e.g., API call)
    }
  }, [debouncedQuery]);
  return (
    <Page scrollable>
      <ThemedTextInput
        placeholder="Search Shows"
        size={"xxxl"}
        style={{ fontWeight: "bold" }}
        placeholderTextColor={theme.onSurface}
        autoFocus
        onChangeText={(text) => {
          setQuery(text.toLowerCase());
        }}
        wrapper={{
          backgroundColor: "transparent",
          borderWidth: 0,
        }}
      />
      {(isLoading || isFetching) && <ThemedActivityIndicator />}
      {error && (
        <ThemedErrorCard title="Something went wrong" error={error.message} />
      )}
      <Box gap={10}>
        {shows.map((show) => (
          <ShowCard show={show} key={show.url} />
        ))}
      </Box>
    </Page>
  );
}
