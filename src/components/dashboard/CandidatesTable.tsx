import { Candidate } from "@/types/election";
import { PartyBadge } from "./PartyBadge";
import { cn } from "@/lib/utils";

interface CandidatesTableProps {
  candidates: Candidate[];
  totalVotes: number;
}

export function CandidatesTable({ candidates, totalVotes }: CandidatesTableProps) {
  const top5TotalVotes = candidates.reduce((sum, c) => sum + c.Votes_Secured, 0);

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">
          Top 5 Candidates
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="py-3 px-4 text-left font-medium text-muted-foreground w-16">Rank</th>
              <th className="py-3 px-4 text-left font-medium text-muted-foreground">Candidate Name</th>
              <th className="py-3 px-4 text-left font-medium text-muted-foreground">Party</th>
              <th className="py-3 px-4 text-right font-medium text-muted-foreground">Votes Secured</th>
              <th className="py-3 px-4 text-right font-medium text-muted-foreground">Vote Share %</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr
                key={candidate.Rank}
                className={cn(
                  "transition-colors hover:bg-muted/50 border-b border-border/50",
                  candidate.Rank === 1 && "bg-winner/5"
                )}
              >
                <td className="py-3 px-4">
                  <span
                    className={cn(
                      "inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
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
                <td className="py-3 px-4">
                  <span
                    className={cn(
                      "font-medium",
                      candidate.Rank === 1 && "text-winner font-semibold"
                    )}
                  >
                    {candidate.Name}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <PartyBadge party={candidate.Party} size="sm" navigateToDetail={true} />
                </td>
                <td className="py-3 px-4 text-right font-mono font-medium">
                  {candidate.Votes_Secured.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right font-mono text-muted-foreground">
                  {totalVotes > 0 ? ((candidate.Votes_Secured / totalVotes) * 100).toFixed(2) : "0.00"}%
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-muted/30 font-medium">
            <tr>
              <td colSpan={3} className="py-3 px-4 text-right text-muted-foreground">Top 5 Total:</td>
              <td className="py-3 px-4 text-right font-mono text-foreground">{top5TotalVotes.toLocaleString()}</td>
              <td className="py-3 px-4 text-right font-mono text-muted-foreground">
                {totalVotes > 0 ? ((top5TotalVotes / totalVotes) * 100).toFixed(2) : "0.00"}%
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
