import Box from "@/components/reusables/Box";
import Page from "@/components/reusables/Page";
import ThemedButton from "@/components/reusables/ThemedButton";
import ThemedSettingSwitch from "@/components/reusables/ThemedSettingSwitch";
import { PERSISTED_APP_STATE, setSetting } from "@/valitio.store";
import * as Updates from "expo-updates";
import { useSnapshot } from "valtio";
import AppHeader from "@/components/AppHeader";
import ThemedText from "@/components/reusables/ThemedText";
import ThemedCard from "@/components/reusables/ThemedCard";

export default function Settings() {
  const APP_STATE = useSnapshot(PERSISTED_APP_STATE);

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
