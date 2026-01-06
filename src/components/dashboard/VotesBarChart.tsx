import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Candidate } from "@/types/election";
import { getPartyColor } from "@/lib/partyColors";

interface VotesBarChartProps {
  candidates: Candidate[];
}

export function VotesBarChart({ candidates }: VotesBarChartProps) {
  const data = candidates.map((c) => ({
    name: c.Name.length > 15 ? c.Name.substring(0, 15) + "..." : c.Name,
    fullName: c.Name,
    votes: c.Votes_Secured,
    party: c.Party,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground">{item.fullName}</p>
          <p className="text-sm text-muted-foreground">{item.party}</p>
          <p className="text-lg font-bold text-foreground mt-1">
            {item.votes.toLocaleString()} votes
          </p>
        </div>
      );
    }
    return null;
  };

  // Get unique parties from data for legend
  const uniqueParties = [...new Set(data.map((d) => d.party))];

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm animate-fade-in">
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Top 5 Candidates by Votes
        </h3>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
            <XAxis
              type="number"
              tickFormatter={(value) => value.toLocaleString()}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))" }} />
            <Bar dataKey="votes" radius={[0, 6, 6, 0]} barSize={32}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getPartyColor(entry.party)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Party Legend */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex flex-wrap gap-3 justify-center">
          {uniqueParties.map((party) => (
            <div key={party} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: getPartyColor(party) }}
              />
              <span className="text-xs text-muted-foreground">{party}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
