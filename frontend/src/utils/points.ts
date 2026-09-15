// Whole number of points greater than zero, or undefined if invalid.
export function parsePoints(value: string) {
  const text = value.trim();
  if (!/^\d+$/.test(text)) return undefined;
  const points = BigInt(text);
  return points > 0n ? points : undefined;
}
