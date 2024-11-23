import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ThemeType = "light" | "dark" | "system";

interface SettingsStoreType {
    theme: ThemeType;
}

const SettingsStore = create(persist<SettingsStoreType>((set, get) => ({
    theme: "system",
}), {
    name: "settings",
    storage: createJSONStorage(() => AsyncStorage)
}))


export default SettingsStore;