import { ThemeType } from "@/types/app.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { proxy, subscribe } from "valtio";

interface SettingsStateType {
  theme: ThemeType;
}

export const SETTINGS_STATE = proxy<SettingsStateType>({
  theme: "system",
});

const persistSettingsData = async () => {
  await AsyncStorage.setItem("settings", JSON.stringify(SETTINGS_STATE));
};

const loadPersistedSettingsData = async () => {
  const value = await AsyncStorage.getItem("settings");
  if (value) {
    const parsedState = JSON.parse(value) as SettingsStateType;
    for (const [key, value] of Object.entries(parsedState)) {
      SETTINGS_STATE[key as keyof SettingsStateType] = value;
    }
  }
};

export function setupSettingsStore() {
  loadPersistedSettingsData();

  const unsubscribe = subscribe(SETTINGS_STATE, () => {
    persistSettingsData();
  });

  return unsubscribe;
}

export function setTheme(theme: ThemeType) {
  SETTINGS_STATE.theme = theme;
}

export function getTheme(): ThemeType {
  return SETTINGS_STATE.theme;
}
