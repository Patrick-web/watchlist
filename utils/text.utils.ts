export function changeCase(
	inputString: string,
	targetCasing:
		| "lower"
		| "upper"
		| "title"
		| "sentence"
		| "camel"
		| "kebab"
		| "snake"
): string {
	try {
		switch (targetCasing) {
			case "lower":
				return inputString.toLowerCase();
			case "upper":
				return inputString.toUpperCase();
			case "title":
				return inputString.replace(/\b\w/g, (char) => char.toUpperCase());
			case "sentence":
				return (
					inputString.charAt(0).toUpperCase() +
					inputString.slice(1).toLowerCase()
				);
			case "camel":
				return inputString.replace(/[-_\s]+(.)?/g, (_match, char) =>
					char ? char.toUpperCase() : ""
				);
			case "kebab":
				return inputString.replace(/\s+/g, "-").toLowerCase();
			case "snake":
				return inputString.replace(/\s+/g, "_").toLowerCase();
			default:
				return inputString;
		}
	} catch {
		return inputString;
	}
}

export function formatCardNumber(cardNumber: string): string {
	const _cardNumber = cardNumber;
	// Remove any existing spaces or non-numeric characters
	const cleanedNumber = _cardNumber.replace(/\D/g, "");

	// Define the format with spaces every 4 digits
	const formattedNumber = cleanedNumber.replace(/(\d{4})/g, "$1 ").trim();

	return formattedNumber;
}

export function formatCardExpiryDate(expiryDate: string): string {
	// Remove any existing spaces or non-numeric characters
	const cleanedDate = expiryDate.replace(/\D/g, "");

	// Define the format with a slash between the month and year
	const formattedDate = cleanedDate.replace(/(\d{2})(\d{2})/, "$1/$2").trim();

	return formattedDate;
}
