import { getPartyColor, getPartyIcon } from "@/lib/partyColors";

const MAIN_PARTIES = ["TDP", "YSRCP", "BJP", "INC", "JnP", "IND"];

interface PartyLegendProps {
  parties?: string[];
  compact?: boolean;
}

export function PartyLegend({ parties = MAIN_PARTIES, compact = false }: PartyLegendProps) {
  return (
    <div className={`flex flex-wrap gap-3 ${compact ? "gap-2" : "gap-3"}`}>
      {parties.map((party) => {
        const IconComponent = getPartyIcon(party);
        return (
          <div
            key={party}
            className="flex items-center gap-1.5 text-sm text-muted-foreground"
          >
            <div
              className={`${compact ? "w-2.5 h-2.5" : "w-3 h-3"} rounded-full flex items-center justify-center`}
              style={{ backgroundColor: getPartyColor(party) }}
            />
            {IconComponent && (
              <IconComponent className={`${compact ? "w-3 h-3" : "w-4 h-4"}`} />
            )}
            <span className={compact ? "text-xs" : "text-sm"}>{party}</span>
          </div>
        );
      })}
    </div>
  );
}
