import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import ThemedIcon, { ThemedIconProps } from "./reusables/ThemedIcon";
import ThemedText from "./reusables/ThemedText";
import { useTheme, useThemeMode } from "@/hooks/useTheme.hook";
import { sWidth } from "@/constants/dimensions.constant";
import { LinearGradient } from "expo-linear-gradient";

const ACTION_WIDTH = sWidth - 40;

interface SwipeActionProps {
  direction: "left" | "right";
  drag: SharedValue<number>;
  label: string;
  icon: ThemedIconProps;
}

export default function SwipeAction({
  drag,
  direction,
  label,
  icon,
}: SwipeActionProps) {
  const leftStyleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value - ACTION_WIDTH }],
    };
  });

  const rightStyleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value + ACTION_WIDTH }],
    };
  });

  const dragStyle =
    direction === "left" ? leftStyleAnimation : rightStyleAnimation;

  const theme = useTheme();
  const themeMode = useThemeMode();

  const endColor =
    themeMode === "dark" ? "rgba(32,32,32,0)" : "rgba(255,255,255,0)";

  return (
    <Reanimated.View
      style={[
        dragStyle,
        {
          width: ACTION_WIDTH,
        },
      ]}
    >
      <LinearGradient
        colors={
          direction === "left"
            ? [theme.surface, endColor]
            : [endColor, theme.surface]
        }
        start={direction === "left" ? [0, 1] : [1, 0]}
        end={direction === "left" ? [1, 0] : [0, 1]}
        style={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          borderRadius: 80,
        }}
      >
        <ThemedIcon {...icon} />
        <ThemedText fontWeight="bold" textAlign="center">
          {label}
        </ThemedText>
      </LinearGradient>
    </Reanimated.View>
  );
}
