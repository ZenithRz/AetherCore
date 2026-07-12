export function generateSerialNumber(discordId: string): string {
  let hash = 0;
  for (let i = 0; i < discordId.length; i++) {
    const char = discordId.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  const base = Math.abs(hash).toString(36).toUpperCase().padStart(4, "0").slice(0, 4);
  return `AC-${base}-0X${discordId.slice(-4).toUpperCase()}`;
}
