import { useTheme } from "@/hooks/useTheme.hook";
import { Switch, SwitchProps } from "react-native";
import ThemedActivityIndicator from "./ThemedActivityIndicator";
import { forwardRef } from "react";

const ThemedSwitchButton = forwardRef<
  Switch,
  SwitchProps & { loading?: boolean }
>((props, ref) => {
  const theme = useTheme();
  return (
    <>
      {props.loading ? (
        <ThemedActivityIndicator />
      ) : (
        <Switch
          {...props}
          ref={ref}
          trackColor={{ false: "white", true: theme.primary }}
          thumbColor={"white"}
        />
      )}
    </>
  );
});

export default ThemedSwitchButton;
