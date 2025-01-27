import { cleanTitle } from "@/lib/scrape";
import Box, { AnimatedBox } from "./reusables/Box";
import ThemedButton from "./reusables/ThemedButton";
import { Children, ReactNode, useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  requestNotificationPermission,
  scheduleNotification,
} from "@/lib/refresh";
import { toast } from "sonner-native";
import ThemedIcon from "./reusables/ThemedIcon";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import { SUCCESS_ALERT } from "@/constants/common.constants";
import { FadeInUp } from "react-native-reanimated";
import { ThemedDatePicker } from "./reusables/ThemedDatePicker";
import { notificationAsync, NotificationFeedbackType } from "expo-haptics";
import { MovieInfo, NewEpisode, ShowInfo } from "@/types";
import {
  onEpisodeReminderSet,
  PERSISTED_APP_STATE,
  setSetting,
} from "@/valitio.store";
import ThemedBottomSheet from "./reusables/ThemedBottomSheet";
import { useSnapshot } from "valtio";

const hours = [
  "1:00",
  "2:00",
  "3:00",
  "4:00",
  "5:00",
  "6:00",
  "7:00",
  "8:00",
  "9:00",
  "10:00",
  "11:00",
  "12:00",
];

const timeOfDays = ["AM", "PM"];

interface Day {
  label: string;
  date: Date;
}

function generateDateLabels(): Day[] {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Calculate the next Saturday and Sunday
  const dayOfWeek = today.getDay();
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7; // 6 is Saturday
  const daysUntilSunday = (0 - dayOfWeek + 7) % 7; // 0 is Sunday

  const thisSaturday = new Date(today);
  thisSaturday.setDate(today.getDate() + daysUntilSaturday);

  const thisSunday = new Date(today);
  thisSunday.setDate(today.getDate() + daysUntilSunday);

  return [
    { label: "Today", date: today },
    { label: "Tomorrow", date: tomorrow },
    { label: "This Saturday", date: thisSaturday },
    { label: "This Sunday", date: thisSunday },
  ];
}

type ReminderFormProps =
  | {
      movie: MovieInfo;
      episode?: never;
      show?: never;
      close: () => void;
      visible: boolean;
      children?: ReactNode;
    }
  | {
      movie?: never;
      episode: NewEpisode;
      show?: never;
      close: () => void;
      visible: boolean;
      children?: ReactNode;
    }
  | {
      movie?: never;
      episode?: never;
      show: ShowInfo;
      close: () => void;
      visible: boolean;
      children?: ReactNode;
    };

export default function ReminderForm({
  episode,
  movie,
  show,
  close,
  visible,
  children,
}: ReminderFormProps) {
  const APP_STATE = useSnapshot(PERSISTED_APP_STATE);

  const days = generateDateLabels();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<string>("AM");
  const [selectedHour, setSelectedHour] = useState("");
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  const [customDate, setCustomDate] = useState<Date | null>(null);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    const $date = customDate ?? selectedDay?.date;
    if ($date) {
      $date.setHours(0, 0, 0);
      setSelectedDate($date);
    } else {
      setSelectedDate(null);
    }
  }, [customDate, selectedDay]);

  function setTime({ hour, period }: { hour?: string; period?: string }) {
    if (hour) setSelectedHour(hour);

    if (period) setTimeOfDay(period);

    const $hour = parseInt((hour || selectedHour).split(":")[0]);
    const $period = period || timeOfDay;

    setSelectedDate((current) => {
      const $date = current;
      if (!$date) return current;

      if ($period === "AM") {
        $date.setHours($hour);
      } else {
        const the24 = $hour + 12 > 23 ? 0 : $hour + 12;
        $date.setHours(the24, 0, 0);
      }
      return $date;
    });
  }

  function checkReminderNotification() {
    if (APP_STATE.settings.reminderNotification === false) {
      toast.warning("Reminder notifications are disabled", {
        richColors: true,
        icon: (
          <Box block align="center" mb={10}>
            <ThemedIcon name="alert-circle" color="error" />
          </Box>
        ),
        action: (
          <ThemedButton
            label="Enable them"
            size="xs"
            type="primary"
            mt={10}
            onPress={() => {
              setSetting("reminderNotification", true);
              createReminder();
            }}
          />
        ),
        duration: 3000,
        ...SUCCESS_ALERT,
      });
      return;
    }
    createReminder();
  }

  async function createReminder() {
    if (!selectedDate) {
      toast.error("Oops, could not create reminder", {
        richColors: true,
        icon: (
          <Box block align="center">
            <ThemedIcon name="alert-circle" color="error" />
          </Box>
        ),
        ...SUCCESS_ALERT,
      });
      return;
    }
    const trigger = new Date(selectedDate);

    // dynamic message based on what is passed in i.e movie, episode or show
    const message = () => {
      if (movie) {
        return `Watch ${cleanTitle(movie.title)}`;
      } else if (episode) {
        return `Watch ${cleanTitle(episode.show.title)} Episode ${
          episode.show.episode
        }`;
      } else if (show) {
        return `Watch ${cleanTitle(show.title)}`;
      }
    };

    try {
      await scheduleNotification({
        content: {
          title: `Are you free now? `,
          body: message(),
          sound: "defualt",
        },
        trigger: __DEV__
          ? {
              type: SchedulableTriggerInputTypes.TIME_INTERVAL,
              seconds: 10,
              repeats: false,
            }
          : {
              type: SchedulableTriggerInputTypes.DATE,
              date: trigger,
            },
      });

      toast.success("Reimder Set 🔔", {
        icon: (
          <Box block align="center">
            <ThemedIcon name="check-circle" color="success" />
          </Box>
        ),
        ...SUCCESS_ALERT,
      });

      notificationAsync(NotificationFeedbackType.Success);

      // onEpisodeReminderSet(episode, trigger);

      close();
    } catch (error) {
      console.error(error);
      toast.success("Couldn't set Reminder", {
        icon: (
          <Box block align="center">
            <ThemedIcon name="alert-circle" color="error" />
          </Box>
        ),
        ...SUCCESS_ALERT,
        description: (error as Error)?.message || JSON.stringify(error),
      });
    }
  }

  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <ThemedBottomSheet
      title="Remind me to watch"
      visible={visible}
      close={close}
      icon={{
        name: "alarm-bell",
        source: "MaterialCommunityIcons",
      }}
      containerProps={{ pb: 80, gap: 20, radius: 60 }}
    >
      {children}
      <Box block px={15} gap={20}>
        <Box
          direction="row"
          block
          justify="space-between"
          align="stretch"
          wrap="wrap"
          rowGap={15}
        >
          {days.map((day) => (
            <Box
              width={
                selectedDay?.label === day.label
                  ? "100%"
                  : selectedDay || customDate
                  ? "0%"
                  : "48%"
              }
              overflow="hidden"
              key={day.label}
            >
              <ThemedButton
                label={day.label}
                width={"100%"}
                height={80}
                type={
                  selectedDay?.label === day.label ? "secondary" : "surface"
                }
                labelProps={{
                  fontWeight:
                    selectedDay?.label === day.label ? "bold" : "normal",

                  size: selectedDay?.label === day.label ? "xl" : "md",
                }}
                onPress={() => {
                  if (selectedDay?.label === day.label) {
                    setSelectedDay(null);
                  } else {
                    setSelectedDay(day);
                  }
                }}
              />
            </Box>
          ))}

          <Box
            width={customDate ? "100%" : selectedDay ? "0%" : "100%"}
            overflow="hidden"
          >
            <ThemedButton
              icon={customDate ? undefined : { name: "calendar" }}
              label={
                customDate
                  ? selectedDate?.toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      weekday: "long",
                    })
                  : "Let me pick"
              }
              width={"100%"}
              height={80}
              direction="column"
              justify="center"
              type={customDate ? "secondary" : "surface"}
              onPress={() => {
                setShowDatePicker(true);
              }}
              pressabelProps={{
                onLongPress: () => {
                  setCustomDate(null);
                },
              }}
            />
            <ThemedDatePicker
              showPicker={showDatePicker}
              onClosePicker={() => {
                setShowDatePicker(false);
              }}
              onPickDate={(date) => {
                setCustomDate(date);
              }}
              minDate={new Date()}
            />
          </Box>
        </Box>
        {selectedDate && (
          <Box direction="row-reverse" align="center" gap={20}>
            <Box height={"100%"} gap={10} py={20}>
              {timeOfDays.map((td) => (
                <ThemedButton
                  label={td}
                  flex={1}
                  type={td === timeOfDay ? "secondary" : "surface"}
                  onPress={() => {
                    setTime({ period: td });
                  }}
                  size="xs"
                  key={td}
                />
              ))}
            </Box>
            <Box
              direction="row"
              wrap="wrap"
              justify="space-between"
              flex={1}
              rowGap={10}
            >
              {hours.map((hour) => (
                <ThemedButton
                  type={selectedHour === hour ? "secondary" : "surface"}
                  label={hour}
                  width={"30%"}
                  size="sm"
                  key={hour}
                  onPress={() => {
                    setTime({ hour });
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
        {selectedDate && selectedHour && (
          <AnimatedBox block viewProps={{ entering: FadeInUp }}>
            <ThemedButton label={"Done"} onPress={checkReminderNotification} />
          </AnimatedBox>
        )}
      </Box>
    </ThemedBottomSheet>
  );
}
