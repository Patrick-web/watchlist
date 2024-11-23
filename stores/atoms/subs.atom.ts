import { atomWithStorage, createJSONStorage } from "jotai/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ShowInfo } from "@/lib/scrape";

const storage = createJSONStorage<ShowInfo[]>(() => AsyncStorage);

export const subscribedShowsAtom = atomWithStorage<ShowInfo[]>(
  "subscriptions",
  [],
  storage,
);

export const showsWithNewEpisodesAtom = atomWithStorage<ShowInfo[]>(
  "newEpisodes",
  [],
  storage,
);
