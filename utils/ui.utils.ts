export function generateRandomPastelColor() {
	const hue = Math.floor(Math.random() * 360);
	const pastel = `hsl(${hue}, 100%, 90%)`;
	const contrast = `hsl(${(hue + 180) % 360}, 100%, 50%)`;
	return { pastel, contrast };
}

export function hslDarken(color: string, amount: number) {
	const [hue, sat, light] = color.match(/\d+/g)!.map(Number);
	return `hsl(${hue}, ${sat}%, ${light - amount}%)`;
}
