import { Sun, Waves, Flame, TreeDeciduous, Scale, User, Circle } from "lucide-react";
import { LucideIcon } from "lucide-react";

// Party color mapping for consistent visualization
export const PARTY_COLORS: Record<string, string> = {
  TDP: "hsl(45, 100%, 50%)",      // Gold/Yellow
  YSRCP: "hsl(200, 80%, 50%)",    // Blue
  BJP: "hsl(25, 100%, 55%)",      // Orange
  INC: "hsl(142, 70%, 40%)",      // Green
  JnP: "hsl(280, 60%, 50%)",      // Purple
  BSP: "hsl(220, 60%, 45%)",      // Dark Blue
  NOTA: "hsl(0, 0%, 50%)",        // Gray
  IND: "hsl(0, 0%, 60%)",         // Light Gray
};

// Party icon mapping using Lucide icons as symbolic representations
export const PARTY_ICONS: Record<string, LucideIcon> = {
  TDP: Sun,           // Cycle/Sun symbol
  YSRCP: Waves,       // Fan/Waves symbol
  BJP: Flame,         // Lotus/Flame symbol
  INC: TreeDeciduous, // Hand/Tree symbol
  JnP: Scale,         // Justice/Scale symbol
  IND: User,          // Independent person
};

export const getPartyColor = (party: string): string => {
  return PARTY_COLORS[party] || "hsl(0, 0%, 70%)";
};

export const getPartyIcon = (party: string): LucideIcon | null => {
  return PARTY_ICONS[party] || null;
};

export const getPartyBgClass = (party: string): string => {
  const bgClasses: Record<string, string> = {
    TDP: "bg-party-tdp",
    YSRCP: "bg-party-ysrcp",
    BJP: "bg-party-bjp",
    INC: "bg-party-inc",
    JnP: "bg-party-jnp",
    BSP: "bg-party-bsp",
    NOTA: "bg-party-nota",
    IND: "bg-party-ind",
  };
  return bgClasses[party] || "bg-party-other";
};

export const getPartyTextClass = (party: string): string => {
  // Parties that need dark text due to light background
  const darkTextParties = ["TDP", "BJP"];
  return darkTextParties.includes(party) ? "text-foreground" : "text-white";
};
