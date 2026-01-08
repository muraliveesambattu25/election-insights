import { useMemo } from "react";
import { ConstituencyData } from "@/types/election";
import { getPartyColor } from "@/lib/partyColors";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Link, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface PartyStatsSummaryProps {
  constituencies: ConstituencyData[];
}

interface PartyStat {
  party: string;
  seats: number;
  votes: number;
  voteShare: number;
}

export function PartyStatsSummary({ constituencies }: PartyStatsSummaryProps) {
  const navigate = useNavigate();
  const stats = useMemo(() => {
    const partyData: Record<string, { seats: number; votes: number }> = {};

    // Calculate Total Valid Votes Polled in the state
    const totalPolledVotes = constituencies.reduce((sum, c) => {
      const pollPercent = parseFloat(c.Polling_Percentage.replace('%', ''));
      const polled = Math.round(c.Total_Electors * pollPercent / 100);
      return sum + polled;
    }, 0);

    constituencies.forEach((c) => {
      const winnerParty = c.Winner_Details.Party;
      if (!partyData[winnerParty]) {
        partyData[winnerParty] = { seats: 0, votes: 0 };
      }
      partyData[winnerParty].seats += 1;

      c.Top_5_Candidates.forEach((cand) => {
        const p = cand.Party;
        if (!partyData[p]) {
          partyData[p] = { seats: 0, votes: 0 };
        }
        partyData[p].votes += cand.Votes_Secured;
      });
    });

    const result: PartyStat[] = Object.entries(partyData).map(([party, data]) => ({
      party,
      seats: data.seats,
      votes: data.votes,
      voteShare: totalPolledVotes > 0 ? (data.votes / totalPolledVotes) * 100 : 0
    }));

    return result.sort((a, b) => {
      if (b.seats !== a.seats) return b.seats - a.seats;
      return b.votes - a.votes;
    });

  }, [constituencies]);

  const totalSeats = constituencies.length;

  const handleBarClick = (data: any) => {
    if (data && data.party) {
      navigate(`/party/${encodeURIComponent(data.party)}`);
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const percentage = ((item.seats / totalSeats) * 100).toFixed(1);
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground">{item.party}</p>
          <p className="text-lg font-bold text-foreground">
            {item.seats} seats ({percentage}%)
          </p>
          <p className="text-[10px] text-muted-foreground mt-1 italic">Click to view details</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="animate-fade-in text-card-foreground shadow-sm bg-card border-border h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold">Party Performance</CardTitle>
            <CardDescription>Seats and Vote Share</CardDescription>
          </div>
          <div className="text-right">
            <span className="text-sm text-muted-foreground font-medium">Total Seats</span>
            <p className="text-2xl font-bold">{totalSeats}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.slice(0, 8)} layout="vertical" margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
              <XAxis
                type="number"
                hide
              />
              <YAxis
                type="category"
                dataKey="party"
                width={60}
                tick={{ fill: "hsl(var(--foreground))", fontSize: 11, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }} />
              <Bar
                dataKey="seats"
                radius={[0, 4, 4, 0]}
                barSize={24}
                onClick={handleBarClick}
                className="cursor-pointer"
              >
                {stats.slice(0, 8).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getPartyColor(entry.party)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-md border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="border-border hover:bg-muted/50">
                <TableHead className="font-semibold text-foreground h-9">Party</TableHead>
                <TableHead className="text-right font-semibold text-foreground h-9">Seats</TableHead>
                <TableHead className="text-right font-semibold text-foreground h-9">Votes</TableHead>
                <TableHead className="text-right font-semibold text-foreground h-9">Share %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.map((stat) => (
                <TableRow key={stat.party} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium py-2">
                    <Link to={`/party/${encodeURIComponent(stat.party)}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: getPartyColor(stat.party) }}
                      />
                      {stat.party}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right py-2 font-medium">{stat.seats}</TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground py-2 text-xs sm:text-sm">
                    {stat.votes.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground py-2 text-xs sm:text-sm">
                    {stat.voteShare.toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
