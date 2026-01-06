import { Link } from "react-router-dom";
import { ConstituencyData } from "@/types/election";
import { ConstituencySelector } from "./ConstituencySelector";
import { Vote, List } from "lucide-react";
import { Button } from "@/components/ui/button";

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
          <div className="flex items-center gap-3">
            <ConstituencySelector
              constituencies={constituencies}
              selectedAC={selectedAC}
              onSelect={onSelect}
            />
            <Link to="/constituencies">
              <Button variant="outline" size="sm">
                <List className="h-4 w-4 mr-1.5" />
                View All
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
