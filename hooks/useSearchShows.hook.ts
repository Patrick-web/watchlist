import { extractSearchResults, F_HEADERS } from "@/lib/scrape";
import { useQuery } from "@tanstack/react-query";

const useSearch = (query: string) => {
  return useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      const resp = await fetch(
        `https://fmovies.ps/search/${encodeURI(query)}`,
        {
          method: "GET",
          headers: F_HEADERS,
        },
      );
      const html = await resp.text();
      return extractSearchResults(html);
    },
    enabled: !!query,
    initialData: { shows: [], movies: [] },
    retry: false,
  });
};

export default useSearch;
