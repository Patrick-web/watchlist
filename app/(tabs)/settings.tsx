import Box from "@/components/reusables/Box";
import Page from "@/components/reusables/Page";
import ThemedButton from "@/components/reusables/ThemedButton";
import ThemedIcon from "@/components/reusables/ThemedIcon";
import ThemedSettingSwitch from "@/components/reusables/ThemedSettingSwitch";
import ThemedStepper from "@/components/reusables/ThemedStepper";
import ThemedText from "@/components/reusables/ThemedText";
import SubscribedShow from "@/components/SubscribedShow";
import { useTheme } from "@/hooks/useTheme.hook";
import { PERSISTED_APP_STATE } from "@/valitio.store";
import { router } from "expo-router";
import { Switch } from "react-native";
import Reanimated, { LinearTransition } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSnapshot } from "valtio";

export default function Shows() {
  const APP_STATE = useSnapshot(PERSISTED_APP_STATE);
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  return (
    <Page>
      <Box mb={20}>
        <ThemedText size={"xl"} fontWeight="bold">
          SETTINGS
        </ThemedText>
      </Box>
      <Box flex={1}>
        <ThemedText size={"xl"} fontWeight="bold" mb={20}>
          Notifications
        </ThemedText>
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
      </Box>
    </Page>
  );
}
