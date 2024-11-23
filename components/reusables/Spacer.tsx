import React from "react";
import { ViewStyle } from "react-native";
import Box from "./Box";

export default function Spacer({
	height = 0,
	width = 0,
	...extra
}: {
	height?: ViewStyle["height"];
	width?: ViewStyle["width"];
}) {
	return <Box height={height} width={width} {...extra} />;
}
