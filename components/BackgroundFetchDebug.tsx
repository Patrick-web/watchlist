import {
  unregisterBackgroundFetchAsync,
  registerBackgroundFetchAsync,
  CHECK_EPISODES_TASK,
} from "@/lib/backgroundTasks";
import { useState, useEffect } from "react";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import ThemedText from "./reusables/ThemedText";
import ThemedButton from "./reusables/ThemedButton";
import Box from "./reusables/Box";

export default function BackgroundFetchScreen() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [status, setStatus] =
    useState<BackgroundFetch.BackgroundFetchStatus | null>(null);

  useEffect(() => {
    checkStatusAsync();
  }, []);

  const checkStatusAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered =
      await TaskManager.isTaskRegisteredAsync(CHECK_EPISODES_TASK);
    setStatus(status);
    setIsRegistered(isRegistered);
  };

  const toggleFetchTask = async () => {
    if (isRegistered) {
      await unregisterBackgroundFetchAsync();
    } else {
      await registerBackgroundFetchAsync();
    }

    checkStatusAsync();
  };

  return (
    <Box>
      <Box>
        <ThemedText>
          Background fetch status:
          <ThemedText>
            {status && BackgroundFetch.BackgroundFetchStatus[status]}
          </ThemedText>
        </ThemedText>
        <ThemedText>
          Background fetch task name:
          <ThemedText>
            {isRegistered ? CHECK_EPISODES_TASK : "Not registered yet!"}
          </ThemedText>
        </ThemedText>
      </Box>
      <ThemedButton
        label={
          isRegistered
            ? "Unregister BackgroundFetch task"
            : "Register BackgroundFetch task"
        }
        type="secondary"
        onPress={toggleFetchTask}
      />
    </Box>
  );
}
