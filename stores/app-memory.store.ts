import AsyncStorage from "@react-native-async-storage/async-storage";
import { proxy, subscribe } from "valtio";

interface MemoryEntry<T> {
  route: string;
  params?: Record<string, Record<string, unknown>> | undefined;
  data: T;
}

interface AppMemoryStateType {
  routeToRestore: string;
  entries: MemoryEntry<any>[];
}

export const APP_MEMORY_STATE = proxy<AppMemoryStateType>({
  routeToRestore: "",
  entries: [],
});

const persistAppMemoryData = async () => {
  await AsyncStorage.setItem("app-memory", JSON.stringify(APP_MEMORY_STATE));
};

const loadPersistedAppMemoryData = async () => {
  const value = await AsyncStorage.getItem("app-memory");
  if (value) {
    const parsedState = JSON.parse(value) as AppMemoryStateType;
    for (const [key, value] of Object.entries(parsedState)) {
      APP_MEMORY_STATE[key as keyof AppMemoryStateType] = value;
    }
  }
};

export function setupAppMemoryStore() {
  loadPersistedAppMemoryData();

  const unsubscribe = subscribe(APP_MEMORY_STATE, () => {
    persistAppMemoryData();
  });

  return unsubscribe;
}

export function addEntry<T>(newEntry: MemoryEntry<T>) {
  console.log("Adding entry", newEntry);
  APP_MEMORY_STATE.entries = [
    ...APP_MEMORY_STATE.entries.filter((entry) => entry.route !== newEntry.route),
    newEntry,
  ];
}

export function getEntry<T>(route: string): MemoryEntry<T> | undefined {
  return APP_MEMORY_STATE.entries.find((entry) => entry.route === route) as MemoryEntry<T> | undefined;
}

export function deleteEntry(route: string) {
  APP_MEMORY_STATE.entries = APP_MEMORY_STATE.entries.filter((entry) => entry.route !== route);
}

export function clearMemory() {
  APP_MEMORY_STATE.entries = [];
  APP_MEMORY_STATE.routeToRestore = "";
}

export function setRouteToRestore(route: string) {
  APP_MEMORY_STATE.routeToRestore = route;
}