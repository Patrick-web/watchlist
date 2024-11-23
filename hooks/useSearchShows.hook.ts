import { extractShows, F_HEADERS } from "@/lib/scrape";
import { useQuery } from "@tanstack/react-query";

const useSearchShows = (query: string) => {
  return useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      const data = new URLSearchParams();
      data.append("keyword", query);
      const resp = await fetch("https://fmovies.ps/ajax/search", {
        method: "POST",
        body: data.toString(),
        headers: F_HEADERS,
      });
      const html = await resp.text();
      return extractShows(html);
    },
    enabled: !!query,
    initialData: [],
  });
};

export default useSearchShows;
