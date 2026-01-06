import { cn } from "@/lib/utils";
import { getPartyBgClass, getPartyTextClass, getPartyIcon } from "@/lib/partyColors";

interface PartyBadgeProps {
  party: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs gap-1",
  md: "px-3 py-1 text-sm gap-1.5",
  lg: "px-4 py-1.5 text-base gap-2",
};

const iconSizes = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

export function PartyBadge({ party, size = "md", showIcon = true }: PartyBadgeProps) {
  const IconComponent = getPartyIcon(party);
  
  return (
    <span
      className={cn(
        "party-badge font-semibold inline-flex items-center",
        sizeStyles[size],
        getPartyBgClass(party),
        getPartyTextClass(party)
      )}
    >
      {showIcon && IconComponent && (
        <IconComponent className={iconSizes[size]} />
      )}
      {party}
    </span>
  );
}
