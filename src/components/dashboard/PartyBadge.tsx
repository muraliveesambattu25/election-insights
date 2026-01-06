import { cn } from "@/lib/utils";
import { getPartyBgClass, getPartyTextClass } from "@/lib/partyColors";

interface PartyBadgeProps {
  party: string;
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-1.5 text-base",
};

export function PartyBadge({ party, size = "md" }: PartyBadgeProps) {
  return (
    <span
      className={cn(
        "party-badge font-semibold",
        sizeStyles[size],
        getPartyBgClass(party),
        getPartyTextClass(party)
      )}
    >
      {party}
    </span>
  );
}
