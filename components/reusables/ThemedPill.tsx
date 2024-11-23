import { useTheme } from "@/hooks/useTheme.hook";
import React from "react";
import Box, { BoxProps } from "./Box";
import ThemedIcon, { ThemedIconProps } from "./ThemedIcon";
import ThemedText from "./ThemedText";

export default function ThemedPill({
	appendIcon,
	prependIcon,
	label,
	children,
	...rest
}: ThemedPillProps) {
	const theme = useTheme();
	return (
		<Box
			px={10}
			py={6}
			radius={20}
			direction="row"
			align="center"
			gap={5}
			color={theme.lightBackground}
		>
			{appendIcon && <ThemedIcon {...appendIcon} />}
			{label && (
				<ThemedText align="center" size={"xs"} fontWeight="light">
					{label}
				</ThemedText>
			)}
			{children}
			{prependIcon && <ThemedIcon {...prependIcon} />}
		</Box>
	);
}

interface ThemedPillProps extends BoxProps {
	appendIcon?: ThemedIconProps;
	prependIcon?: ThemedIconProps;
	onPress?: () => void;
	label?: string;
	children?: React.ReactNode;
}
