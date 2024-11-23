import EpisodeCard from "@/components/EpisodeCard";
import EpisodeChecker from "@/components/EpisodeChecker";
import Box from "@/components/reusables/Box";
import Page from "@/components/reusables/Page";
import ThemedText from "@/components/reusables/ThemedText";
import { showsWithNewEpisodesAtom } from "@/stores/atoms/subs.atom";
import { useAtom } from "jotai";

export default function HomeScreen() {
  const [withNewEpisode, setWithNewEpisode] = useAtom(showsWithNewEpisodesAtom);
  return (
    <Page scrollable>
      <EpisodeChecker />
      <Box>
        <ThemedText size={"xxl"} fontWeight="bold">
          NEW EPISODES
        </ThemedText>
      </Box>
      <Box gap={40}>
        {withNewEpisode.map((show) => (
          <EpisodeCard key={show.url} episode={show} />
        ))}
      </Box>
    </Page>
  );
}
