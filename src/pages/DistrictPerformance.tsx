import { useMemo, useState } from "react";
import { ElectionData, ConstituencyData } from "@/types/election";
import electionDataRaw from "@/data/electionData.json";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { PartyBadge } from "@/components/dashboard/PartyBadge";
import { getPartyColor } from "@/lib/partyColors";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CandidatesTable } from "@/components/dashboard/CandidatesTable";
import { Button } from "@/components/ui/button";
import { X, Search, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";

const electionData = electionDataRaw as ElectionData;
const constituencies = electionData.AndhraPradeshAssemblyElections2024;

interface DistrictStats {
    name: string;
    totalSeats: number;
    partyWins: Record<string, number>;
    totalVotes: number;
}

const DistrictPerformance = () => {
    const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    const uniqueDistricts = useMemo(() => {
        const districts = Array.from(new Set(constituencies.map((c) => c.District || "Unknown")));
        return districts.sort();
    }, []);

    const districtStats = useMemo(() => {
        const stats: Record<string, DistrictStats> = {};

        constituencies.forEach((c) => {
            const districtName = c.District || "Unknown";

            if (!stats[districtName]) {
                stats[districtName] = {
                    name: districtName,
                    totalSeats: 0,
                    partyWins: {},
                    totalVotes: 0,
                };
            }

            stats[districtName].totalSeats += 1;
            const winnerParty = c.Winner_Details.Party;
            stats[districtName].partyWins[winnerParty] = (stats[districtName].partyWins[winnerParty] || 0) + 1;

            const pollPercent = parseFloat(c.Polling_Percentage.replace('%', ''));
            const polled = Math.round(c.Total_Electors * pollPercent / 100);
            stats[districtName].totalVotes += polled;
        });

        const order = [
            "Srikakulam", "Vizianagaram", "Visakhapatnam", "East Godavari",
            "West Godavari", "Krishna", "Guntur", "Prakasam",
            "Nellore", "Y.S.R. Kadapa", "Kurnool", "Anantapur", "Chittoor"
        ];

        let result = Object.values(stats);

        // Apply search filter for overview cards
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(d => d.name.toLowerCase().includes(query));
        }

        return result.sort((a, b) => {
            const indexA = order.indexOf(a.name);
            const indexB = order.indexOf(b.name);
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return a.name.localeCompare(b.name);
        });
    }, [searchQuery]);

    const selectedDistrictConstituencies = useMemo(() => {
        if (selectedDistrict === "all") return [];
        return constituencies.filter(c => c.District === selectedDistrict)
            .sort((a, b) => a.AC_No - b.AC_No);
    }, [selectedDistrict]);

    return (
        <div className="container py-8 space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">District Analysis</h1>
                    <p className="text-muted-foreground">Performance breakdown by District</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* District Selector */}
                    <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                        <SelectTrigger className="w-56 bg-card">
                            <SelectValue placeholder="Select District" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border border-border z-50">
                            <SelectItem value="all">All Districts</SelectItem>
                            {uniqueDistricts.map(d => (
                                <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {selectedDistrict === "all" ? (
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search district..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                            {searchQuery && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                                    onClick={() => setSearchQuery("")}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            onClick={() => setSelectedDistrict("all")}
                            className="flex items-center gap-2"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Back to Overview
                        </Button>
                    )}
                </div>
            </div>

            {selectedDistrict === "all" ? (
                /* Overview Cards Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {districtStats.map((district) => (
                        <Card
                            key={district.name}
                            className="hover:shadow-md transition-shadow cursor-pointer border-border group"
                            onClick={() => setSelectedDistrict(district.name)}
                        >
                            <CardHeader className="pb-3 border-b border-border/50 group-hover:bg-muted/30 transition-colors">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl">{district.name}</CardTitle>
                                    <span className="text-sm font-medium text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-full">
                                        {district.totalSeats} Constituencies
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-4">
                                    <div className="h-4 w-full flex rounded-full overflow-hidden">
                                        {Object.entries(district.partyWins)
                                            .sort(([, a], [, b]) => b - a)
                                            .map(([party, wins]) => (
                                                <div
                                                    key={party}
                                                    className="h-full first:rounded-l-full last:rounded-r-full"
                                                    style={{
                                                        width: `${(wins / district.totalSeats) * 100}%`,
                                                        backgroundColor: getPartyColor(party),
                                                    }}
                                                    title={`${party}: ${wins}`}
                                                />
                                            ))}
                                    </div>

                                    <div className="space-y-2">
                                        {Object.entries(district.partyWins)
                                            .sort(([, a], [, b]) => b - a)
                                            .map(([party, wins]) => (
                                                <div key={party} className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <PartyBadge party={party} size="sm" navigateToDetail={true} />
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span className="font-bold">{wins}</span>
                                                        <span className="text-muted-foreground text-xs">seats</span>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>

                                    <div className="pt-2 mt-2 border-t border-border/50 flex justify-between items-center text-xs text-muted-foreground">
                                        <span>Total Votes Polled</span>
                                        <span className="font-mono font-medium text-foreground">{district.totalVotes.toLocaleString()}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                /* Detailed View of Constituencies in Selected District */
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-muted/30 rounded-xl p-6 border border-border flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-1">{selectedDistrict} District Details</h2>
                            <p className="text-muted-foreground">Detailed performance for {selectedDistrictConstituencies.length} constituencies</p>
                        </div>
                    </div>

                    <Accordion type="multiple" className="w-full space-y-4">
                        {selectedDistrictConstituencies.map((constituency) => {
                            const totalVotesCast = Math.round(
                                constituency.Total_Electors * parseFloat(constituency.Polling_Percentage.replace('%', '')) / 100
                            );

                            return (
                                <AccordionItem
                                    key={constituency.AC_No}
                                    value={`item-${constituency.AC_No}`}
                                    className="border rounded-xl bg-card overflow-hidden px-4 sm:px-6"
                                >
                                    <AccordionTrigger className="hover:no-underline py-6">
                                        <div className="flex items-center gap-4 text-left w-full mr-4">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold shrink-0">
                                                {constituency.AC_No}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                                    <h3 className="text-lg font-bold truncate">{constituency.Constituency_Name}</h3>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <span>{constituency.Total_Electors.toLocaleString()} Electors</span>
                                                        <span>•</span>
                                                        <span className="font-medium text-foreground">{constituency.Polling_Percentage} Polling</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="hidden sm:block text-right">
                                                <PartyBadge party={constituency.Winner_Details.Party} size="sm" navigateToDetail={true} />
                                                <p className="text-[10px] text-muted-foreground mt-0.5">Winner: {constituency.Winner_Details.Name}</p>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-6">
                                        <div className="space-y-4 pt-2">
                                            <div className="sm:hidden mb-4 p-3 bg-muted/30 rounded-lg flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] text-muted-foreground">Winner</p>
                                                    <p className="text-sm font-bold">{constituency.Winner_Details.Name}</p>
                                                </div>
                                                <PartyBadge party={constituency.Winner_Details.Party} size="sm" navigateToDetail={true} />
                                            </div>
                                            <CandidatesTable
                                                candidates={constituency.Top_5_Candidates}
                                                totalVotes={totalVotesCast}
                                            />
                                            <div className="flex justify-end pt-2 text-xs text-muted-foreground italic">
                                                Winning Margin: {constituency.Winning_Margin.toLocaleString()} votes
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>
                </div>
            )}
        </div>
    );
};

export default DistrictPerformance;
