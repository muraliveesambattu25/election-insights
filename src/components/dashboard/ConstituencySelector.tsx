import { useState, useEffect } from "react";
import { ConstituencyData } from "@/types/election";
import { MapPin, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

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
  const [open, setOpen] = useState(false);
  const selectedConstituency = constituencies.find((c) => c.AC_No === selectedAC);

  // Auto-focus the input when popover opens
  useEffect(() => {
    if (open) {
      // Small delay to ensure the popover is fully rendered and Portal is mounted
      const timer = setTimeout(() => {
        // Query from document since PopoverContent uses Portal
        const input = document.querySelector('[cmdk-input]') as HTMLInputElement;
        if (input) {
          input.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <MapPin className="h-5 w-5" />
        <span className="text-sm font-medium hidden sm:inline">Constituency:</span>
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[280px] justify-between bg-card"
          >
            {selectedConstituency ? (
              <>
                <span className="font-mono text-muted-foreground mr-2">
                  #{selectedConstituency.AC_No}
                </span>
                <span className="truncate">{selectedConstituency.Constituency_Name}</span>
              </>
            ) : (
              "Select constituency..."
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[280px] p-0" 
          align="start"
          onInteractOutside={(e) => {
            // Allow clicks outside to close
          }}
        >
          <Command shouldFilter={true}>
            <CommandInput placeholder="Search constituency..." />
            <CommandList>
              <CommandEmpty>No constituency found.</CommandEmpty>
              <CommandGroup>
                {constituencies.map((c) => (
                  <CommandItem
                    key={c.AC_No}
                    value={`${c.AC_No} ${c.Constituency_Name}`}
                    onSelect={() => {
                      onSelect(c.AC_No);
                      setOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedAC === c.AC_No ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="font-mono text-muted-foreground mr-2">
                      #{c.AC_No}
                    </span>
                    {c.Constituency_Name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
