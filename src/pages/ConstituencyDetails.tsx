import { useParams } from "react-router-dom";
import { ElectionData, ConstituencyData } from "@/types/election";
import electionDataRaw from "@/data/electionData.json";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { KPICard } from "@/components/dashboard/KPICard";
import { CandidateCard } from "@/components/dashboard/CandidateCard";
import { VotesBarChart } from "@/components/dashboard/VotesBarChart";
import { VoteShareChart } from "@/components/dashboard/VoteShareChart";
import { CandidatesTable } from "@/components/dashboard/CandidatesTable";
import { Ban, MapPin, Percent, TrendingUp, Users } from "lucide-react";

const electionData = electionDataRaw as ElectionData;
const constituencies = electionData.AndhraPradeshAssemblyElections2024;

const ConstituencyDetails = () => {
  const { acNo } = useParams();
  const selectedAC = acNo ? parseInt(acNo) : 1;
  const selectedConstituency = constituencies.find(
    (c) => c.AC_No === selectedAC
  ) as ConstituencyData;

  if (!selectedConstituency) {
    return <div className="container py-8">Constituency not found.</div>;
  }

  const totalVotesCast = selectedConstituency.Top_5_Candidates.reduce(
    (sum, c) => sum + c.Votes_Secured,
    0
  );
  const pollingPercent = parseFloat(
    selectedConstituency.Polling_Percentage.replace(" %", "")
  );

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        constituencies={constituencies}
        selectedAC={selectedAC}
        selectedConstituency={selectedConstituency}
      />
      <main className="container py-8 space-y-8">
        {/* Constituency Title */}
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full mb-3">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              AC #{selectedConstituency.AC_No}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            {selectedConstituency.Constituency_Name}
          </h2>
        </div>
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Electors"
            value={selectedConstituency.Total_Electors.toLocaleString()}
            subtitle="Registered voters"
            icon={Users}
            variant="electors"
          />
          <KPICard
            title="Polling Percentage"
            value={selectedConstituency.Polling_Percentage}
            subtitle={`${Math.round(
              (pollingPercent / 100) * selectedConstituency.Total_Electors
            ).toLocaleString()} votes cast`}
            icon={Percent}
            variant="polling"
          />
          <KPICard
            title="Winning Margin"
            value={selectedConstituency.Winning_Margin.toLocaleString()}
            subtitle="Vote difference"
            icon={TrendingUp}
            variant="margin"
          />
          <KPICard
            title="NOTA Votes"
            value={selectedConstituency.NOTA_Votes.toLocaleString()}
            subtitle="None of the above"
            icon={Ban}
            variant="nota"
          />
        </div>
        {/* Winner & Runner-up Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CandidateCard
            name={selectedConstituency.Winner_Details.Name}
            party={selectedConstituency.Winner_Details.Party}
            votes={selectedConstituency.Winner_Details.Votes_Secured}
            type="winner"
            totalVotes={totalVotesCast}
          />
          <CandidateCard
            name={selectedConstituency.Runner_up_Details.Name}
            party={selectedConstituency.Runner_up_Details.Party}
            votes={selectedConstituency.Runner_up_Details.Votes_Secured}
            type="runner"
            totalVotes={totalVotesCast}
          />
        </div>
        {/* Vote Gap Visual */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm animate-fade-in">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Vote Gap Analysis
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="w-32 text-sm font-medium text-foreground truncate">
                {selectedConstituency.Winner_Details.Name.split(" ")[0]}
              </span>
              <div className="flex-1 h-8 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-winner rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      (selectedConstituency.Winner_Details.Votes_Secured /
                        totalVotesCast) *
                      100
                    }%`,
                  }}
                />
              </div>
              <span className="w-20 text-right font-mono font-semibold">
                {(
                  (selectedConstituency.Winner_Details.Votes_Secured /
                    totalVotesCast) *
                  100
                ).toFixed(1)}
                %
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-32 text-sm font-medium text-muted-foreground truncate">
                {selectedConstituency.Runner_up_Details.Name.split(" ")[0]}
              </span>
              <div className="flex-1 h-8 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-muted-foreground/30 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      (selectedConstituency.Runner_up_Details.Votes_Secured /
                        totalVotesCast) *
                      100
                    }%`,
                  }}
                />
              </div>
              <span className="w-20 text-right font-mono text-muted-foreground">
                {(
                  (selectedConstituency.Runner_up_Details.Votes_Secured /
                    totalVotesCast) *
                  100
                ).toFixed(1)}
                %
              </span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border text-center">
            <span className="text-sm text-muted-foreground">
              Winner leads by{" "}
              <span className="font-bold text-winner">
                {selectedConstituency.Winning_Margin.toLocaleString()}
              </span>{" "}
              votes ({
                (
                  (selectedConstituency.Winning_Margin / totalVotesCast) *
                  100
                ).toFixed(1)
              }
              % margin)
            </span>
          </div>
        </div>
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VotesBarChart candidates={selectedConstituency.Top_5_Candidates} />
          <VoteShareChart candidates={selectedConstituency.Top_5_Candidates} />
        </div>
        {/* Candidates Table */}
        <CandidatesTable candidates={selectedConstituency.Top_5_Candidates} />
        {/* Footer */}
        <footer className="text-center py-6 text-sm text-muted-foreground">
          <p>
            Data source: Andhra Pradesh State Election Commission, 2024
          </p>
        </footer>
      </main>
    </div>
  );
};

export default ConstituencyDetails;
