import Box from "@/components/reusables/Box";
import ThemedText from "@/components/reusables/ThemedText";
import { Link, Stack } from "expo-router";
import { StyleSheet } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <Box style={styles.container}>
        <ThemedText style={styles.title}>This screen doesn't exist.</ThemedText>

        <Link href="/" style={styles.link}>
          <ThemedText style={styles.linkText}>Go to home screen!</ThemedText>
        </Link>
      </Box>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});
