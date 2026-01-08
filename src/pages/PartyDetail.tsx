import { useMemo } from "react";
import { SEO } from "@/components/layout/SEO";
import { useParams, Link } from "react-router-dom";
import { ElectionData, ConstituencyData } from "@/types/election";
import electionDataRaw from "@/data/electionData.json";
import { PartyBadge } from "@/components/dashboard/PartyBadge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MapPin, Award, Users, TrendingUp } from "lucide-react";

const electionData = electionDataRaw as ElectionData;
const constituencies = electionData.AndhraPradeshAssemblyElections2024;

const PartyDetail = () => {
    const { partyName } = useParams<{ partyName: string }>();
    const decodedPartyName = decodeURIComponent(partyName || "");

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
            <div className="flex items-center gap-4">
                <Link to="/party-performance">
                    <Button variant="ghost" size="icon">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div className="flex items-center gap-3">
                    <PartyBadge party={decodedPartyName} size="lg" />
                    <h1 className="text-3xl font-bold">Performance Summary</h1>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Award className="h-4 w-4" /> Seats Won
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{partyStats.wins.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">out of {constituencies.length} seats</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Users className="h-4 w-4" /> Total Votes Secured
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{partyStats.totalVotes.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">Across all constituencies</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" /> Vote Share
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{partyStats.voteShare.toFixed(2)}%</div>
                        <p className="text-xs text-muted-foreground mt-1">State-wide percentage</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Wins by District */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg">Seats by District</CardTitle>
                        <CardDescription>Regional performance breakdown</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {Object.entries(partyStats.districtBreakdown)
                                .sort(([, a], [, b]) => b - a)
                                .map(([district, seats]) => (
                                    <div key={district} className="flex items-center justify-between">
                                        <span className="text-sm font-medium">{district}</span>
                                        <div className="flex items-center gap-3 flex-1 px-4">
                                            <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary"
                                                    style={{ width: `${(seats / Math.max(...Object.values(partyStats.districtBreakdown))) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold min-w-[20px] text-right">{seats}</span>
                                    </div>
                                ))}
                            {Object.keys(partyStats.districtBreakdown).length === 0 && (
                                <p className="text-sm text-muted-foreground py-4 text-center">No seats won in any district.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Won Constituencies Table */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg">Constituencies Won</CardTitle>
                        <CardDescription>List of seats where {decodedPartyName} was victorious</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border border-border overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="w-16">AC</TableHead>
                                        <TableHead>Constituency</TableHead>
                                        <TableHead>District</TableHead>
                                        <TableHead>Candidate</TableHead>
                                        <TableHead className="text-right">Margin</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {partyStats.wins.length > 0 ? (
                                        partyStats.wins.map((c) => (
                                            <TableRow key={c.AC_No}>
                                                <TableCell className="font-mono text-xs">{c.AC_No}</TableCell>
                                                <TableCell>
                                                    <Link to={`/constituency/${c.AC_No}`} className="font-bold text-primary hover:underline">
                                                        {c.Constituency_Name}
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="text-sm">{c.District}</TableCell>
                                                <TableCell className="text-sm font-medium">{c.Winner_Details.Name}</TableCell>
                                                <TableCell className="text-right font-mono text-xs text-winner font-bold">
                                                    +{c.Winning_Margin.toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
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
