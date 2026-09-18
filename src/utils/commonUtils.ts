import { useTheme } from "@/hooks/use-theme";
import { ColorValue } from "react-native";

export interface DescSection {
  label: string;
  text: string;
}

export interface ExpiryStatus {
  label: string;
  expired: boolean;
}

export function parseDescription(desc?: string): DescSection[] {
  if (!desc) return [];
  const chunks = desc.split(/\n?\*\s+/).filter((c) => c.trim().length > 0);

  return chunks.map((chunk) => {
    const match = chunk.match(/^([A-Z]+)\.\.\.(.*)$/s);
    const cleaned = (match ? match[2] : chunk).replace(/\s*\n\s*/g, " ").trim();
    return { label: match ? match[1] : "", text: cleaned };
  });
}

export function cleanParagraph(text?: string): string {
  if (!text) return "";
  return text.replace(/\s*\n\s*/g, " ").trim();
}

export function getExpiryStatus(iso?: string): ExpiryStatus {
  if (!iso) return { label: "", expired: false };
  const diff = new Date(iso).getTime() - Date.now();
  if (isNaN(diff)) return { label: "", expired: false };
  if (diff <= 0) return { label: "Expired", expired: true };

  const hours = Math.floor(diff / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);

  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return { label: `Expires in ${days}d`, expired: false };
  }
  if (hours > 0)
    return { label: `Expires in ${hours}h ${mins}m`, expired: false };
  return { label: `Expires in ${mins}m`, expired: false };
}

export function getSeverityColor(
  severity: string | undefined,
  theme: ReturnType<typeof useTheme>,
): ColorValue {
  const errorColor = theme.error ?? theme.text.primary;
  switch (severity?.trim().toLowerCase()) {
    case "extreme":
      return errorColor;
    case "severe":
      return `${errorColor}CC`;
    case "moderate":
      return theme.warning ?? theme.text.secondary;
    case "minor":
      return theme.info ?? theme.text.secondary;
    default:
      return theme.text.secondary;
  }
}
