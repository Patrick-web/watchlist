import React, { useState } from "react";
import Box from "./Box";
import ThemedIcon, { ThemedIconProps } from "./ThemedIcon";
import ThemedButton from "./ThemedButton";

export function ThemedRating({ rating }: { rating: number }) {
  const stars = new Array(5).fill(0);
  return (
    <Box direction="row" gap={5}>
      {stars.map((_, index) => (
        <RatingStar key={index} active={rating >= index + 1} />
      ))}
    </Box>
  );
}

export function ThemedRatingButton({
  onSelect,
  defaultRating = 0,
}: {
  onSelect: (rating: number) => void;
  defaultRating?: number;
}) {
  const stars = new Array(5).fill(0);
  const [rating, setRating] = useState(defaultRating);
  return (
    <Box direction="row" gap={5} align="center" justify="center">
      {stars.map((_, index) => (
        <ThemedButton
          onPress={() => {
            setRating(index + 1);
            onSelect(index + 1);
          }}
          key={index}
          type="text"
        >
          <RatingStar active={rating >= index + 1} size={"xxl"} />
        </ThemedButton>
      ))}
    </Box>
  );
}

function RatingStar({
  active,
  size = "md",
}: {
  active: boolean;
  size?: ThemedIconProps["size"];
}) {
  return (
    <>
      {active ? (
        <ThemedIcon name="star" source="AntDesign" size={size} />
      ) : (
        <ThemedIcon name="staro" source="AntDesign" size={size} />
      )}
    </>
  );
}
