import { Candidate } from "@/types/election";
import { PartyBadge } from "./PartyBadge";
import { cn } from "@/lib/utils";

interface CandidatesTableProps {
  candidates: Candidate[];
}

export function CandidatesTable({ candidates }: CandidatesTableProps) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">
          Top 5 Candidates
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr className="bg-muted/50">
              <th>Rank</th>
              <th>Candidate Name</th>
              <th>Party</th>
              <th className="text-right">Votes Secured</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr
                key={candidate.Rank}
                className={cn(
                  "transition-colors hover:bg-muted/50",
                  candidate.Rank === 1 && "winner-row"
                )}
              >
                <td>
                  <span
                    className={cn(
                      "inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold",
                      candidate.Rank === 1
                        ? "bg-winner text-white"
                        : candidate.Rank === 2
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {candidate.Rank}
                  </span>
                </td>
                <td>
                  <span
                    className={cn(
                      "font-medium",
                      candidate.Rank === 1 && "text-winner font-semibold"
                    )}
                  >
                    {candidate.Name}
                  </span>
                </td>
                <td>
                  <PartyBadge party={candidate.Party} size="sm" />
                </td>
                <td className="text-right font-mono font-semibold">
                  {candidate.Votes_Secured.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
