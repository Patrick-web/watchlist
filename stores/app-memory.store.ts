import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface MemoryEntry<T> {
  route: string;
  params?: Record<string, {}> | undefined;
  data: T;
}

interface AppMemoryStoreInterface {
  routeToRestore: string;
  entries: MemoryEntry<any>[];
  addEntry: <T>(newEntry: MemoryEntry<T>) => void;
  getEntry: <T>(route: string) => MemoryEntry<T> | undefined;
  deleteEntry: (route: string) => void;
  clearMemory: () => void;
}

const AppMemoryStore = create(
  persist<AppMemoryStoreInterface>(
    (set, get) => ({
      routeToRestore: "",
      entries: [],
      addEntry: (newEntry) => {
        console.log("Adding entry", newEntry);
        set({
          entries: [
            ...get().entries.filter((entry) => entry.route !== newEntry.route),
            newEntry,
          ],
        });
      },
      getEntry: (route) => {
        return get().entries.find((entry) => entry.route === route);
      },
      deleteEntry: (route) => {
        set({
          entries: get().entries.filter((entry) => entry.route !== route),
        });
      },
      clearMemory: () => {
        set({ entries: [], routeToRestore: "" });
      },
    }),
    {
      name: "app-memory",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default AppMemoryStore;
