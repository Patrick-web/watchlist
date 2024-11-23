import React from "react";
import { ActivityIndicator, ActivityIndicatorProps } from "react-native";
import { useTheme } from "../../hooks/useTheme.hook";

export default function ThemedActivityIndicator(props: ActivityIndicatorProps) {
	const theme = useTheme();

	return <ActivityIndicator color={theme.text} {...props} />;
}
