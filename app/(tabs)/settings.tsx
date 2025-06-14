import Box from "@/components/reusables/Box";
import Page from "@/components/reusables/Page";
import ThemedButton from "@/components/reusables/ThemedButton";
import ThemedSettingSwitch from "@/components/reusables/ThemedSettingSwitch";
import ThemedSegmentedPicker from "@/components/reusables/ThemedSegmentedPicker";
import { PERSISTED_APP_STATE, setSetting } from "@/valitio.store";
import * as Updates from "expo-updates";
import { useSnapshot } from "valtio";
import AppHeader from "@/components/AppHeader";
import ThemedText from "@/components/reusables/ThemedText";
import ThemedCard from "@/components/reusables/ThemedCard";

import { SETTINGS_STATE } from "@/stores/settings.store";
import { ThemeType } from "@/types/app.types";
import ThemedSettingItem from "@/components/reusables/ThemedSettingItem";

export default function Settings() {
  const APP_STATE = useSnapshot(PERSISTED_APP_STATE);
  const SETTINGS = useSnapshot(SETTINGS_STATE);

  const runtime = Updates.runtimeVersion;

  const { isUpdateAvailable, isDownloading } = Updates.useUpdates();

  async function updateOTA() {
    try {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch {
      /* ignore errors */
    }
  }

  const themeModes: ThemeType[] = ["light", "dark", "system"];

  return (
    <Page>
      <AppHeader title="Settings" />
      <Box flex={0.9} justify="space-between">
        <Box gap={20}>
          <ThemedSettingSwitch
            title="New Episodes"
            subtitle="Notify me on new episode releases"
            isActive={APP_STATE.settings.newEpisodeNotification}
            onToggle={(value) => {
              setSetting("newEpisodeNotification", value);
            }}
          />
          <ThemedSettingSwitch
            title="Reminders"
            subtitle="Enable reminders you have created"
            isActive={APP_STATE.settings.reminderNotification}
            onToggle={(value) => {
              setSetting("reminderNotification", value);
            }}
          />

          <ThemedSettingItem title="Theme" subtitle="Pick your app theme">
            <ThemedSegmentedPicker
              size="xs"
              width={"40%"}
              options={themeModes}
              selectedIndex={themeModes.findIndex(
                (mode) => mode.toLowerCase() === SETTINGS.theme.toLowerCase(),
              )}
              onSelect={({ index }) => {
                const modeSelected = themeModes[index];
                SETTINGS_STATE.theme = modeSelected;
              }}
              getIcon={(mode) => {
                switch (mode) {
                  case "light":
                    return { name: "sun", source: "Feather" };
                  case "dark":
                    return { name: "moon", source: "Feather" };
                  case "system":
                    return { name: "smartphone", source: "Feather" };
                  default:
                    return { name: "sun", source: "Feather" };
                }
              }}
            />
          </ThemedSettingItem>
        </Box>
        {isUpdateAvailable && (
          <ThemedCard
            title="New Update available"
            icon={{ name: "burst-new", source: "Foundation" }}
          >
            <ThemedButton
              size="sm"
              label={"Update Now"}
              type="primary"
              loading={isDownloading}
              onPress={updateOTA}
            />
          </ThemedCard>
        )}
        <ThemedText align="center" opacity={0.8}>
          v{runtime}
        </ThemedText>
      </Box>
    </Page>
  );
}
