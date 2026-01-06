import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConstituencyData } from "@/types/election";
import { MapPin } from "lucide-react";

interface ConstituencySelectorProps {
  constituencies: ConstituencyData[];
  selectedAC: number;
  onSelect: (acNo: number) => void;
}

export function ConstituencySelector({
  constituencies,
  selectedAC,
  onSelect,
}: ConstituencySelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <MapPin className="h-5 w-5" />
        <span className="text-sm font-medium hidden sm:inline">Constituency:</span>
      </div>
      <Select
        value={selectedAC.toString()}
        onValueChange={(value) => onSelect(parseInt(value))}
      >
        <SelectTrigger className="w-[280px] bg-card">
          <SelectValue placeholder="Select constituency" />
        </SelectTrigger>
        <SelectContent className="max-h-[400px]">
          {constituencies.map((c) => (
            <SelectItem key={c.AC_No} value={c.AC_No.toString()}>
              <span className="font-mono text-muted-foreground mr-2">
                #{c.AC_No}
              </span>
              {c.Constituency_Name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
