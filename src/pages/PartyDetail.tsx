import { useMemo, useState } from "react";
import { SEO } from "@/components/layout/SEO";
import { useParams, Link } from "react-router-dom";
import { ElectionData, ConstituencyData } from "@/types/election";
import electionDataRaw from "@/data/electionData.json";
import { PartyBadge } from "@/components/dashboard/PartyBadge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MapPin, Award, Users, TrendingUp } from "lucide-react";
import { getPartyBgClass, getPartyTextClass } from "@/lib/partyColors";
import { cn } from "@/lib/utils";

const electionData = electionDataRaw as ElectionData;
const constituencies = electionData.AndhraPradeshAssemblyElections2024;

const PartyDetail = () => {
    const { partyName } = useParams<{ partyName: string }>();
    const decodedPartyName = decodeURIComponent(partyName || "");
    const [logoError, setLogoError] = useState(false);

    const partyStats = useMemo(() => {
        const wins = constituencies.filter(c => c.Winner_Details.Party === decodedPartyName);

        let totalVotes = 0;
        constituencies.forEach(c => {
            const partyPerformance = c.Top_5_Candidates.find(cand => cand.Party === decodedPartyName);
            if (partyPerformance) {
                totalVotes += partyPerformance.Votes_Secured;
            }
        });

        const totalValidVotesInState = constituencies.reduce((sum, c) => {
            const pollPercent = parseFloat(c.Polling_Percentage.replace('%', ''));
            const polled = Math.round(c.Total_Electors * pollPercent / 100);
            return sum + polled;
        }, 0);

        return {
            wins,
            totalVotes,
            voteShare: totalValidVotesInState > 0 ? (totalVotes / totalValidVotesInState) * 100 : 0,
            districtBreakdown: wins.reduce((acc, c) => {
                const district = c.District || "Unknown";
                acc[district] = (acc[district] || 0) + 1;
                return acc;
            }, {} as Record<string, number>)
        };
    }, [decodedPartyName]);

    if (!decodedPartyName) return <div>Party not found</div>;

    return (
        <div className="container py-8 space-y-8 animate-fade-in">
            <SEO title={decodedPartyName} />

            {/* Header & Hero Section */}
            <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-sm">
                <div className={cn("h-32 sm:h-48 relative", getPartyBgClass(decodedPartyName))}>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                    <Link to="/party-performance" className="absolute top-4 left-4 z-10">
                        <Button variant="secondary" size="icon" className="rounded-full shadow-lg bg-white/90 hover:bg-white text-foreground">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>

                <div className="px-6 pb-8 -mt-12 sm:-mt-16 relative z-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
                        <div className="relative group">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center">
                                {!logoError ? (
                                    <img
                                        src={`/logos/${decodedPartyName}.png`}
                                        alt={decodedPartyName}
                                        className="w-full h-full object-contain"
                                        onError={() => setLogoError(true)}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-xl">
                                        <Award className="w-12 h-12 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 space-y-2 pb-2">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{decodedPartyName}</h1>
                                <PartyBadge party={decodedPartyName} size="md" />
                            </div>
                            <p className="text-muted-foreground font-medium flex items-center gap-2">
                                <MapPin className="h-4 w-4" /> State Performance • Assembly Elections 2024
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                            <Award className="h-4 w-4 text-primary" /> Seats Won
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-foreground">{partyStats.wins.length}</div>
                        <p className="text-xs font-medium text-muted-foreground mt-1">out of {constituencies.length} total seats</p>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" /> Total Votes Secured
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-foreground">{partyStats.totalVotes.toLocaleString()}</div>
                        <p className="text-xs font-medium text-muted-foreground mt-1">Across all constituencies</p>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-primary" /> Vote Share
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-foreground">{partyStats.voteShare.toFixed(2)}%</div>
                        <p className="text-xs font-medium text-muted-foreground mt-1">State-wide percentage</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Wins by District */}
                <Card className="lg:col-span-1 border-border/50 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Seats by District</CardTitle>
                        <CardDescription>Regional performance breakdown</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {Object.entries(partyStats.districtBreakdown)
                                .sort(([, a], [, b]) => b - a)
                                .map(([district, seats]) => (
                                    <div key={district} className="flex items-center justify-between group">
                                        <span className="text-sm font-semibold group-hover:text-primary transition-colors">{district}</span>
                                        <div className="flex items-center gap-3 flex-1 px-4">
                                            <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary transition-all duration-1000"
                                                    style={{ width: `${(seats / Math.max(...Object.values(partyStats.districtBreakdown))) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                        <span className="text-sm font-black min-w-[20px] text-right">{seats}</span>
                                    </div>
                                ))}
                            {Object.keys(partyStats.districtBreakdown).length === 0 && (
                                <p className="text-sm text-muted-foreground py-12 text-center italic">No seats won in any district.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Won Constituencies Table */}
                <Card className="lg:col-span-2 border-border/50 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Constituencies Won</CardTitle>
                        <CardDescription>List of seats where {decodedPartyName} was victorious</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-xl border border-border/50 overflow-hidden bg-muted/5">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-16 font-bold">AC</TableHead>
                                        <TableHead className="font-bold">Constituency</TableHead>
                                        <TableHead className="font-bold">District</TableHead>
                                        <TableHead className="font-bold">Candidate</TableHead>
                                        <TableHead className="text-right font-bold hover:bg-secondary">Margin</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {partyStats.wins.length > 0 ? (
                                        partyStats.wins.map((c) => (
                                            <TableRow key={c.AC_No} className="hover:bg-muted/30 transition-colors">
                                                <TableCell className="font-mono text-xs font-medium">{c.AC_No}</TableCell>
                                                <TableCell>
                                                    <Link to={`/constituency/${c.AC_No}`} className="font-black text-primary hover:underline decoration-2 underline-offset-4">
                                                        {c.Constituency_Name}
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="text-sm font-medium">{c.District}</TableCell>
                                                <TableCell className="text-sm font-bold text-foreground/80">{c.Winner_Details.Name}</TableCell>
                                                <TableCell className="text-right font-mono text-sm text-winner font-black">
                                                    +{c.Winning_Margin.toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-12 text-muted-foreground italic">
                                                No seats won by this party.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PartyDetail;
