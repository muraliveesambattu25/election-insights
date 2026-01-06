import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Candidate } from "@/types/election";
import { getPartyColor } from "@/lib/partyColors";

interface VoteShareChartProps {
  candidates: Candidate[];
}

export function VoteShareChart({ candidates }: VoteShareChartProps) {
  const totalVotes = candidates.reduce((sum, c) => sum + c.Votes_Secured, 0);

  const data = candidates.map((c) => ({
    name: c.Party,
    value: c.Votes_Secured,
    percentage: ((c.Votes_Secured / totalVotes) * 100).toFixed(1),
    candidateName: c.Name,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground">{item.candidateName}</p>
          <p className="text-sm text-muted-foreground">{item.name}</p>
          <p className="text-lg font-bold text-foreground mt-1">
            {item.value.toLocaleString()} votes ({item.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className="flex flex-wrap justify-center gap-3 mt-4">
        {payload.map((entry: any, index: number) => (
          <li key={`legend-${index}`} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-muted-foreground">{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm animate-fade-in">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Vote Share Distribution
      </h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getPartyColor(entry.name)} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
