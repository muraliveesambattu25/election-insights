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
    <header className="bg-background/80 backdrop-blur-md border-b border-border/40 sticky top-16 z-40 transition-all">
      <div className="container py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4 animate-fade-in">
            <div className="p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/10 shadow-sm">
              <Vote className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-foreground uppercase">
                {selectedConstituency.Constituency_Name}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary uppercase tracking-wider">
                  AC #{selectedConstituency.AC_No}
                </span>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest opacity-70">
                  Constituency Details
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 animate-fade-in delay-75">
            <div className="flex-1 min-w-[240px]">
              <ConstituencySelector
                constituencies={constituencies}
                selectedAC={selectedAC}
                onSelect={onSelect}
              />
            </div>
            <Link to="/">
              <Button variant="ghost" size="sm" className="hidden sm:flex hover:bg-primary/5 hover:text-primary transition-all">
                <List className="h-4 w-4 mr-2" />
                Explore All
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
