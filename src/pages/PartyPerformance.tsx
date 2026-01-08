import { PartyStatsSummary } from "@/components/dashboard/PartyStatsSummary";
import { ElectionData } from "@/types/election";
import electionDataRaw from "@/data/electionData.json";

const electionData = electionDataRaw as ElectionData;
const constituencies = electionData.AndhraPradeshAssemblyElections2024;

const PartyPerformance = () => {
    return (
        <div className="min-h-screen bg-background">
            <main className="container py-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Party Performance</h1>
                <p className="text-muted-foreground mb-6">Detailed Analysis of Votes and Seats</p>
                <PartyStatsSummary constituencies={constituencies} />
            </main>
        </div>
    );
};

export default PartyPerformance;
