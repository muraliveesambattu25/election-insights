import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Vote, ChevronLeft, ChevronRight, ExternalLink, Filter, X, ArrowUpDown, ArrowUp, ArrowDown, Download, AlertTriangle } from "lucide-react";
import { ElectionData, ConstituencyData } from "@/types/election";
import electionDataRaw from "@/data/electionData.json";
import { PartyBadge } from "@/components/dashboard/PartyBadge";
import { PartySeatsSummary } from "@/components/dashboard/PartySeatsSummary";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const electionData = electionDataRaw as ElectionData;
const constituencies = electionData.AndhraPradeshAssemblyElections2024;

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];
const CLOSE_RACE_THRESHOLD = 5000;

// Get unique parties from the data
const uniqueParties = Array.from(
  new Set(constituencies.map((c) => c.Winner_Details.Party))
).sort();

// Calculate seats won by each party
const partySeats = uniqueParties.map((party) => ({
  party,
  seats: constituencies.filter((c) => c.Winner_Details.Party === party).length,
}));

type SortColumn = "ac" | "name" | "winner" | "party" | "votes" | "margin" | "polling";
type SortDirection = "asc" | "desc";

const Constituencies = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedParty, setSelectedParty] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortColumn, setSortColumn] = useState<SortColumn>("ac");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Sort function
  const getSortValue = (c: ConstituencyData, column: SortColumn): string | number => {
    switch (column) {
      case "ac":
        return c.AC_No;
      case "name":
        return c.Constituency_Name.toLowerCase();
      case "winner":
        return c.Winner_Details.Name.toLowerCase();
      case "party":
        return c.Winner_Details.Party.toLowerCase();
      case "votes":
        return c.Winner_Details.Votes_Secured;
      case "margin":
        return c.Winning_Margin;
      case "polling":
        return parseFloat(c.Polling_Percentage.replace(" %", ""));
      default:
        return c.AC_No;
    }
  };

  // Filter and sort constituencies
  const filteredAndSortedConstituencies = useMemo(() => {
    let result = [...constituencies];

    // Filter by party first
    if (selectedParty !== "all") {
      result = result.filter((c) => c.Winner_Details.Party === selectedParty);
    }

    // Then filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.Constituency_Name.toLowerCase().includes(query) ||
          c.AC_No.toString().includes(query) ||
          c.Winner_Details.Name.toLowerCase().includes(query) ||
          c.Winner_Details.Party.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      const aVal = getSortValue(a, sortColumn);
      const bVal = getSortValue(b, sortColumn);
      
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [searchQuery, selectedParty, sortColumn, sortDirection]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedConstituencies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredAndSortedConstituencies.slice(startIndex, endIndex);

  // Handle column sort
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  // Sort indicator component
  const SortIndicator = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 text-foreground" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-foreground" />
    );
  };

  // Reset to page 1 when filters change
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handlePartyChange = (value: string) => {
    setSelectedParty(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedParty("all");
    setSortColumn("ac");
    setSortDirection("asc");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || selectedParty !== "all" || sortColumn !== "ac" || sortDirection !== "asc";

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["AC No", "Constituency", "Winner", "Party", "Votes", "Margin", "Polling %"];
    const rows = filteredAndSortedConstituencies.map((c) => [
      c.AC_No,
      c.Constituency_Name,
      c.Winner_Details.Name,
      c.Winner_Details.Party,
      c.Winner_Details.Votes_Secured,
      c.Winning_Margin,
      c.Polling_Percentage,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ap-elections-2024${selectedParty !== "all" ? `-${selectedParty}` : ""}${searchQuery ? `-${searchQuery}` : ""}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const isCloseRace = (margin: number) => margin < CLOSE_RACE_THRESHOLD;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
                  All Constituencies Overview
                </p>
              </div>
            </div>
            <Link to="/">
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        {/* State-wide Summary */}
        <PartySeatsSummary partySeats={partySeats} />
        {/* Search & Controls */}
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm animate-fade-in">
          <div className="flex flex-col gap-4">
            {/* Search and Party Filter Row */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, AC number, winner..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedParty} onValueChange={handlePartyChange}>
                  <SelectTrigger className="w-40 bg-card">
                    <SelectValue placeholder="All Parties" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border border-border z-50">
                    <SelectItem value="all">All Parties</SelectItem>
                    {uniqueParties.map((party) => (
                      <SelectItem key={party} value={party}>
                        <div className="flex items-center gap-2">
                          <span>{party}</span>
                          <span className="text-xs text-muted-foreground">
                            ({constituencies.filter((c) => c.Winner_Details.Party === party).length})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            </div>
            
            {/* Items per page - aligned right */}
            <div className="flex items-center justify-between">
              {/* Active filter badges */}
              <div className="flex items-center gap-2">
                {selectedParty !== "all" && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-secondary rounded-full">
                    <span className="text-xs text-muted-foreground">Party:</span>
                    <PartyBadge party={selectedParty} size="sm" />
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Show:</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={handleItemsPerPageChange}
                >
                  <SelectTrigger className="w-20 bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border border-border z-50">
                    {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option.toString()}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">per page</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count & Export */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <p className="text-sm text-muted-foreground">
            {filteredAndSortedConstituencies.length > 0 ? (
              <>
                Showing{" "}
                <span className="font-medium text-foreground">
                  {startIndex + 1}-{Math.min(endIndex, filteredAndSortedConstituencies.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {filteredAndSortedConstituencies.length}
                </span>{" "}
                constituencies
                {selectedParty !== "all" && (
                  <span className="ml-1">
                    won by <span className="font-medium">{selectedParty}</span>
                  </span>
                )}
                {searchQuery && (
                  <span className="ml-1">
                    matching "<span className="font-medium">{searchQuery}</span>"
                  </span>
                )}
              </>
            ) : (
              <span>No constituencies found</span>
            )}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            disabled={filteredAndSortedConstituencies.length === 0}
          >
            <Download className="h-4 w-4 mr-1.5" />
            Export CSV
          </Button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr className="bg-muted/50">
                  <th 
                    className="w-20 cursor-pointer select-none hover:bg-muted transition-colors"
                    onClick={() => handleSort("ac")}
                  >
                    <div className="flex items-center gap-1.5">
                      AC No.
                      <SortIndicator column="ac" />
                    </div>
                  </th>
                  <th 
                    className="cursor-pointer select-none hover:bg-muted transition-colors"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-1.5">
                      Constituency
                      <SortIndicator column="name" />
                    </div>
                  </th>
                  <th 
                    className="cursor-pointer select-none hover:bg-muted transition-colors"
                    onClick={() => handleSort("winner")}
                  >
                    <div className="flex items-center gap-1.5">
                      Winner
                      <SortIndicator column="winner" />
                    </div>
                  </th>
                  <th 
                    className="cursor-pointer select-none hover:bg-muted transition-colors"
                    onClick={() => handleSort("party")}
                  >
                    <div className="flex items-center gap-1.5">
                      Party
                      <SortIndicator column="party" />
                    </div>
                  </th>
                  <th 
                    className="text-right cursor-pointer select-none hover:bg-muted transition-colors"
                    onClick={() => handleSort("votes")}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      Votes
                      <SortIndicator column="votes" />
                    </div>
                  </th>
                  <th 
                    className="text-right cursor-pointer select-none hover:bg-muted transition-colors"
                    onClick={() => handleSort("margin")}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      Margin
                      <SortIndicator column="margin" />
                    </div>
                  </th>
                  <th 
                    className="text-right cursor-pointer select-none hover:bg-muted transition-colors"
                    onClick={() => handleSort("polling")}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      Polling %
                      <SortIndicator column="polling" />
                    </div>
                  </th>
                  <th className="w-16"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((constituency) => {
                  const closeRace = isCloseRace(constituency.Winning_Margin);
                  return (
                    <tr
                      key={constituency.AC_No}
                      className={cn(
                        "transition-colors hover:bg-muted/50",
                        closeRace && "bg-amber-500/5"
                      )}
                    >
                      <td>
                        <span className="inline-flex items-center justify-center w-10 h-8 rounded bg-secondary text-secondary-foreground font-mono font-semibold text-sm">
                          {constituency.AC_No}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">
                            {constituency.Constituency_Name}
                          </span>
                          {closeRace && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-amber-500/15 text-amber-600 dark:text-amber-400">
                              <AlertTriangle className="h-3 w-3" />
                              Close
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="text-foreground">
                          {constituency.Winner_Details.Name}
                        </span>
                      </td>
                      <td>
                        <PartyBadge
                          party={constituency.Winner_Details.Party}
                          size="sm"
                        />
                      </td>
                      <td className="text-right font-mono">
                        {constituency.Winner_Details.Votes_Secured.toLocaleString()}
                      </td>
                      <td className="text-right">
                        <span className={cn(
                          "font-mono font-semibold",
                          closeRace ? "text-amber-600 dark:text-amber-400" : "text-winner"
                        )}>
                          +{constituency.Winning_Margin.toLocaleString()}
                        </span>
                      </td>
                      <td className="text-right font-mono text-muted-foreground">
                        {constituency.Polling_Percentage}
                      </td>
                      <td>
                        <Link to={`/?ac=${constituency.AC_No}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {paginatedData.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                No constituencies found matching "{searchQuery}"
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {getPageNumbers().map((page, index) =>
                typeof page === "number" ? (
                  <Button
                    key={index}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-9"
                  >
                    {page}
                  </Button>
                ) : (
                  <span
                    key={index}
                    className="px-2 text-muted-foreground"
                  >
                    {page}
                  </span>
                )
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Constituencies;
