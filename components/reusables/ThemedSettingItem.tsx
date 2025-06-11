import Box from "./Box";
import ThemedText from "./ThemedText";

export default function ThemedSettingItem(props: ThemedSettingItemProps) {
  return (
    <Box direction="row" justify="space-between" block align="center">
      <Box gap={5}>
        <ThemedText>{props.title}</ThemedText>
        {props.subtitle && (
          <ThemedText opacity={0.7} size={"sm"} fontWeight="light">
            {props.subtitle}
          </ThemedText>
        )}
      </Box>
      {props.children}
    </Box>
  );
}

interface ThemedSettingItemProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}
