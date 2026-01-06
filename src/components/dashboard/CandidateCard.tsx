import { cn } from "@/lib/utils";
import { PartyBadge } from "./PartyBadge";
import { Trophy, Medal } from "lucide-react";

interface CandidateCardProps {
  name: string;
  party: string;
  votes: number;
  type: "winner" | "runner";
  totalVotes?: number;
}

export function CandidateCard({ name, party, votes, type, totalVotes }: CandidateCardProps) {
  const isWinner = type === "winner";
  const voteShare = totalVotes ? ((votes / totalVotes) * 100).toFixed(1) : null;

  return (
    <div
      className={cn(
        "animate-scale-in",
        isWinner ? "winner-card" : "runner-card"
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex-shrink-0 p-3 rounded-full",
            isWinner
              ? "bg-winner/10 text-winner"
              : "bg-muted text-muted-foreground"
          )}
        >
          {isWinner ? (
            <Trophy className="h-6 w-6" />
          ) : (
            <Medal className="h-6 w-6" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={cn(
                "text-xs font-medium uppercase tracking-wide",
                isWinner ? "text-winner" : "text-muted-foreground"
              )}
            >
              {isWinner ? "Winner" : "Runner-up"}
            </span>
          </div>
          <h3 className="text-lg font-bold text-foreground truncate">{name}</h3>
          <div className="flex items-center gap-3 mt-2">
            <PartyBadge party={party} size={isWinner ? "md" : "sm"} />
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-2xl font-bold text-foreground">
              {votes.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              votes secured
              {voteShare && (
                <span className="ml-2 font-medium">({voteShare}%)</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
