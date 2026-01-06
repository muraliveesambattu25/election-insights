import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Vote, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { ElectionData } from "@/types/election";
import electionDataRaw from "@/data/electionData.json";
import { PartyBadge } from "@/components/dashboard/PartyBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

const Constituencies = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Filter constituencies based on search
  const filteredConstituencies = useMemo(() => {
    if (!searchQuery.trim()) return constituencies;

    const query = searchQuery.toLowerCase();
    return constituencies.filter(
      (c) =>
        c.Constituency_Name.toLowerCase().includes(query) ||
        c.AC_No.toString().includes(query) ||
        c.Winner_Details.Name.toLowerCase().includes(query) ||
        c.Winner_Details.Party.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredConstituencies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredConstituencies.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

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
        {/* Search & Controls */}
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm animate-fade-in">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, AC number, winner, or party..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Show:</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={handleItemsPerPageChange}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {startIndex + 1}-{Math.min(endIndex, filteredConstituencies.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {filteredConstituencies.length}
            </span>{" "}
            constituencies
            {searchQuery && (
              <span className="ml-1">
                for "<span className="font-medium">{searchQuery}</span>"
              </span>
            )}
          </p>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr className="bg-muted/50">
                  <th className="w-20">AC No.</th>
                  <th>Constituency</th>
                  <th>Winner</th>
                  <th>Party</th>
                  <th className="text-right">Votes</th>
                  <th className="text-right">Margin</th>
                  <th className="text-right">Polling %</th>
                  <th className="w-16"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((constituency) => (
                  <tr
                    key={constituency.AC_No}
                    className="transition-colors hover:bg-muted/50"
                  >
                    <td>
                      <span className="inline-flex items-center justify-center w-10 h-8 rounded bg-secondary text-secondary-foreground font-mono font-semibold text-sm">
                        {constituency.AC_No}
                      </span>
                    </td>
                    <td>
                      <span className="font-medium text-foreground">
                        {constituency.Constituency_Name}
                      </span>
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
                      <span className="font-mono font-semibold text-winner">
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
                ))}
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
