export function generateRandomPastelColor() {
  const hue = Math.floor(Math.random() * 360);
  const pastel = `hsl(${hue}, 100%, 90%)`;
  const contrast = `hsl(${(hue + 180) % 360}, 100%, 50%)`;
  return { pastel, contrast };
}
