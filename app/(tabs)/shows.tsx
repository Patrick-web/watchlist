import Box from "@/components/reusables/Box";
import Page from "@/components/reusables/Page";
import ThemedText from "@/components/reusables/ThemedText";
import SubscriptionCard from "@/components/SubscriptionCard";
import { subscribedShowsAtom } from "@/stores/atoms/subs.atom";
import { useAtom } from "jotai";

export default function Shows() {
  const [subscriptions, setSubscriptions] = useAtom(subscribedShowsAtom);
  console.log(subscriptions);
  return (
    <Page scrollable>
      <Box>
        <ThemedText size={"xxl"} fontWeight="bold">
          WATCHLIST
        </ThemedText>
      </Box>
      <Box
        direction="row"
        justifyContent="space-between"
        wrap="wrap"
        rowGap={10}
      >
        {subscriptions.map((sub) => (
          <SubscriptionCard show={sub} key={sub.url} />
        ))}
      </Box>
    </Page>
  );
}
