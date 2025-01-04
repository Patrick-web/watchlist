import Box from "@/components/reusables/Box";
import Page from "@/components/reusables/Page";
import ThemedButton from "@/components/reusables/ThemedButton";
import ThemedSettingSwitch from "@/components/reusables/ThemedSettingSwitch";
import ThemedText from "@/components/reusables/ThemedText";
import { useTheme } from "@/hooks/useTheme.hook";
import { PERSISTED_APP_STATE } from "@/valitio.store";
import { useState } from "react";
import * as Updates from "expo-updates";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSnapshot } from "valtio";

export default function Settings() {
  const APP_STATE = useSnapshot(PERSISTED_APP_STATE);
  const insets = useSafeAreaInsets();
  const theme = useTheme();

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
    } catch (error) {}
    setCheckingUpdate(false);
  }
  return (
    <Page>
      <Box mb={20}>
        <ThemedText size={"xl"} fontWeight="bold">
          SETTINGS
        </ThemedText>
      </Box>
      <Box flex={0.9} justify="space-between">
        <Box gap={20}>
          <ThemedSettingSwitch
            title="New Episodes"
            subtitle="Notify me on new episode releases"
            isActive={false}
            onToggle={(value) => {}}
          />
          <ThemedSettingSwitch
            title="Reminders"
            subtitle="Enable reminders you have created"
            isActive={true}
            onToggle={(value) => {}}
          />
          <ThemedSettingSwitch
            title="Haptics"
            subtitle="Enable Haptic feedback for app actions"
            isActive={true}
            onToggle={(value) => {}}
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
