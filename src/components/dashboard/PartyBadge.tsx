import { useState } from "react";
import { cn } from "@/lib/utils";
import { getPartyBgClass, getPartyTextClass, getPartyIcon } from "@/lib/partyColors";
import { Link } from "react-router-dom";

interface PartyBadgeProps {
  party: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  navigateToDetail?: boolean;
}

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs gap-1",
  md: "px-3 py-1 text-sm gap-1.5",
  lg: "px-4 py-1.5 text-base gap-2",
};

const iconSizes = {
  sm: "w-5 h-5",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

export function PartyBadge({ party, size = "md", showIcon = true, navigateToDetail = false }: PartyBadgeProps) {
  const [hasError, setHasError] = useState(false);
  const IconComponent = getPartyIcon(party);

  const content = (
    <span
      className={cn(
        "party-badge font-semibold inline-flex items-center whitespace-nowrap",
        sizeStyles[size],
        getPartyBgClass(party),
        getPartyTextClass(party),
        navigateToDetail && "hover:opacity-80 transition-opacity cursor-pointer"
      )}
    >
      {showIcon && (
        <div className={cn("flex items-center justify-center shrink-0", iconSizes[size])}>
          {!hasError ? (
            <img
              src={`/logos/${party}.png`}
              alt={party}
              className="w-full h-full object-contain"
              onError={() => setHasError(true)}
            />
          ) : (
            IconComponent && <IconComponent className="w-full h-full" />
          )}
        </div>
      )}
      <span className="ml-1">{party}</span>
    </span>
  );

  if (navigateToDetail) {
    return (
      <Link
        to={`/party/${encodeURIComponent(party)}`}
        className="inline-block"
        onClick={(e) => e.stopPropagation()}
      >
        {content}
      </Link>
    );
  }

  return content;
}
