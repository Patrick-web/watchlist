import Box from "@/components/reusables/Box";
import Page from "@/components/reusables/Page";
import ThemedButton from "@/components/reusables/ThemedButton";
import ThemedSettingSwitch from "@/components/reusables/ThemedSettingSwitch";
import { PERSISTED_APP_STATE, setSetting } from "@/valitio.store";
import { useState } from "react";
import * as Updates from "expo-updates";
import { useSnapshot } from "valtio";
import AppHeader from "@/components/AppHeader";

export default function Settings() {
  const APP_STATE = useSnapshot(PERSISTED_APP_STATE);

  const [checkingUpdate, setCheckingUpdate] = useState(false);

  async function lookForUpdate() {
    try {
      setCheckingUpdate(true);
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      } else {
        alert("No update found");
      }
    } catch {/* ignore errors */}
    setCheckingUpdate(false);
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
        <ThemedButton
          size="sm"
          label={"Check Update"}
          type="surface"
          loading={checkingUpdate}
          onPress={lookForUpdate}
        />
      </Box>
    </Page>
  );
}
