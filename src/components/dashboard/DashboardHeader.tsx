import { ConstituencyData } from "@/types/election";
import { ConstituencySelector } from "./ConstituencySelector";
import { Vote } from "lucide-react";

interface DashboardHeaderProps {
  constituencies: ConstituencyData[];
  selectedAC: number;
  onSelect: (acNo: number) => void;
  selectedConstituency: ConstituencyData;
}

export function DashboardHeader({
  constituencies,
  selectedAC,
  onSelect,
  selectedConstituency,
}: DashboardHeaderProps) {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-10">
      <div className="container py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary rounded-lg">
              <Vote className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                AP Assembly Elections 2024
              </h1>
              <p className="text-sm text-muted-foreground">
                Constituency Results Dashboard
              </p>
            </div>
          </div>
          <ConstituencySelector
            constituencies={constituencies}
            selectedAC={selectedAC}
            onSelect={onSelect}
          />
        </div>
      </div>
    </header>
  );
}
