import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { getPartyColor } from "@/lib/partyColors";
import { Link, useNavigate } from "react-router-dom";

interface PartySeatsSummaryProps {
    partySeats: { party: string; seats: number }[];
}

export function PartySeatsSummary({ partySeats }: PartySeatsSummaryProps) {
    const sortedData = [...partySeats].sort((a, b) => b.seats - a.seats);
    const totalSeats = sortedData.reduce((sum, p) => sum + p.seats, 0);
    const navigate = useNavigate();

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
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm animate-fade-in">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                    State-wide Summary: Seats Won by Party
                </h3>
                <span className="text-sm text-muted-foreground">
                    Total: {totalSeats} constituencies
                </span>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {sortedData.slice(0, 4).map((item) => (
                    <Link
                        key={item.party}
                        to={`/party/${encodeURIComponent(item.party)}`}
                        className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
                    >
                        <div
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: getPartyColor(item.party) }}
                        />
                        <div className="min-w-0">
                            <p className="text-xs text-muted-foreground truncate group-hover:text-foreground transition-colors">{item.party}</p>
                            <p className="text-lg font-bold text-foreground">{item.seats}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Horizontal bar chart */}
            <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sortedData} layout="vertical" margin={{ left: 10, right: 20 }}>
                        <XAxis
                            type="number"
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                            axisLine={{ stroke: "hsl(var(--border))" }}
                        />
                        <YAxis
                            type="category"
                            dataKey="party"
                            width={80}
                            tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }}
                            axisLine={{ stroke: "hsl(var(--border))" }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }} />
                        <Bar
                            dataKey="seats"
                            radius={[0, 6, 6, 0]}
                            barSize={20}
                            onClick={handleBarClick}
                            className="cursor-pointer"
                        >
                            {sortedData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getPartyColor(entry.party)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
