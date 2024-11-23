import React from "react";
import { useTheme } from "../../hooks/useTheme.hook";
import Box, { BoxProps } from "./Box";
import ThemedIcon, { ThemedIconProps } from "./ThemedIcon";
import ThemedText, { ThemedTextProps } from "./ThemedText";

export default function ThemedSectionCard({
	title,
	titleProps,
	icon,
	headerProps,
	children,
	...boxProps
}: ThemedCardProps) {
	const theme = useTheme();
	return (
		<Box {...boxProps}>
			{(icon || title) && (
				<Box align="center" {...headerProps}>
					{icon && <ThemedIcon size={"xxxl"} {...icon} />}
					{title && (
						<ThemedText
							align="center"
							fontWeight="regular"
							size={"sm"}
							style={{
								opacity: 0.5,
							}}
							{...titleProps}
						>
							{title}
						</ThemedText>
					)}
				</Box>
			)}
			{children}
		</Box>
	);
}

interface ThemedCardProps extends BoxProps {
	title?: string;
	titleProps?: ThemedTextProps;
	headerProps?: BoxProps;
	icon?: ThemedIconProps;
	children?: React.ReactNode;
}
