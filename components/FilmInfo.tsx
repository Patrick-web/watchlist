import { FilmResult } from "@/types";
import he from "he";
import Box from "./reusables/Box";
import ThemedListItem from "./reusables/ThemedListItem";

export default function FilmInfo({ filmInfo }: { filmInfo: FilmResult }) {
  return (
    <Box block>
      <ThemedListItem
        label="Rating"
        value={filmInfo.rating}
        varaint="horizontal"
      />
      <ThemedListItem
        label="Duration"
        value={filmInfo.duration}
        varaint="horizontal"
      />
      <ThemedListItem
        label="Released"
        value={new Date(filmInfo.releaseDate).toDateString()}
        varaint="horizontal"
      />
      <ThemedListItem
        label="Genre"
        value={he.decode(filmInfo.genre)}
        varaint="horizontal"
      />
      <ThemedListItem label="Cast" value={filmInfo.casts.join(", ")} />
    </Box>
  );
}
