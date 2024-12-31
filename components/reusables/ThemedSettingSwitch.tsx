import { Switch } from "react-native";
import Box from "./Box";
import ThemedText from "./ThemedText";

export default function ThemedSettingSwitch(props: ThemedSettingSwitchProps) {
  return (
    <Box direction="row" justify="space-between" block align="center">
      <Box gap={5}>
        <ThemedText>{props.title}</ThemedText>
        <ThemedText opacity={0.7}>{props.subtitle}</ThemedText>
      </Box>
      <Switch onValueChange={props.onToggle} value={props.isActive} />
    </Box>
  );
}

interface ThemedSettingSwitchProps {
  title: string;
  subtitle: string;
  onToggle: (value: boolean) => any;
  isActive: boolean;
}
