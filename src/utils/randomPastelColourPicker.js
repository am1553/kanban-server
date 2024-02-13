export const PASTEL_COLORS = [
  "#ffb3ba",
  "#ffdfba",
  "	#ffffba",
  "#baffc9",
  "#bae1ff",
  "#ffd3fc",
  "#d4f6ff",
  "#c9cfff",
  "#c1b0fc",
  "#bc90dd",
];
export default function randomPastelColour() {
  const randomIndex = Math.floor(Math.random() * PASTEL_COLORS.length);
  return PASTEL_COLORS[randomIndex];
}
