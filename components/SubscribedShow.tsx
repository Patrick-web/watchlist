import React, { useState } from "react";
import { Image } from "expo-image";
import ThemedButton from "./reusables/ThemedButton";
import { POSTER_RATIO, sWidth } from "@/constants/dimensions.constant";
import { TVShowDetailsResponse } from "@/types/tmdb.types";
import { buildImageUrl } from "@/utils/api.utils";
import ShowDetailsModal from "./ShowDetailsModal";

const POSTER_WIDTH = sWidth / 2 - 40;

export default function SubscribedShow({
  show,
}: {
  show: TVShowDetailsResponse;
}) {
  const [showModal, setShowModal] = useState(false);
  console.log(show);
  return (
    <>
      <ThemedButton
        onPress={() => {
          setShowModal(true);
        }}
        type="text"
        alignSelf="center"
      >
        <Image
          source={buildImageUrl(show.poster_path)}
          style={{
            width: POSTER_WIDTH,
            height: POSTER_WIDTH * POSTER_RATIO,
            maxWidth: 200,
            maxHeight: 200 * POSTER_RATIO,
            borderRadius: sWidth / 2,
          }}
        />
      </ThemedButton>

      <ShowDetailsModal
        show={show}
        visible={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
