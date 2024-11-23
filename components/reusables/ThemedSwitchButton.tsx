import { useTheme } from "@/hooks/useTheme.hook";
import { Switch, SwitchProps } from "react-native";
import ThemedActivityIndicator from "./ThemedActivityIndicator";

export default function ThemedSwitchButton(
  props: SwitchProps & { loading?: boolean },
) {
  const theme = useTheme();
  return (
    <>
      {props.loading ? (
        <ThemedActivityIndicator />
      ) : (
        <Switch
          {...props}
          trackColor={{ false: "white", true: theme.primary }}
          thumbColor={"white"}
        />
      )}
    </>
  );
}
