import { useTheme } from "@/hooks/useTheme.hook";
import React from "react";
import Box from "./Box";
import ThemedButton, { ThemedButtonProps } from "./ThemedButton";
import ThemedIcon, { ThemedIconProps } from "./ThemedIcon";
import ThemedText, { ThemedTextProps } from "./ThemedText";

export default function ThemedRadioButton({
	checked = false,
	label,
	labelProps,
	...props
}: ThemedRadioButtonProps) {
	const theme = useTheme();
	return (
		<ThemedButton type="text" {...props}>
			<Box direction="row" align="center" gap={5}>
				{checked ? (
					<ThemedIcon
						name="radio-button-on-sharp"
						source="Ionicons"
						color={theme.primary}
					/>
				) : (
					<ThemedIcon
						name="radio-button-off-sharp"
						source="Ionicons"
						color={theme.primary}
					/>
				)}
				<ThemedText {...labelProps}>{label}</ThemedText>
			</Box>
		</ThemedButton>
	);
}

interface ThemedRadioButtonProps extends ThemedButtonProps {
	checked?: boolean;
	label?: string;
	labelProps?: ThemedTextProps;
	iconProps?: ThemedIconProps;
	onLabelPress?: () => void;
}
