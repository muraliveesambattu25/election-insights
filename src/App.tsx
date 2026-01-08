import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Constituencies from "./pages/Constituencies";
import PartyPerformance from "./pages/PartyPerformance";
import PartyDetail from "./pages/PartyDetail";
import DistrictPerformance from "./pages/DistrictPerformance";
import ConstituencyDetails from "./pages/ConstituencyDetails";
import NotFound from "./pages/NotFound";
import { Layout } from "./components/layout/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Constituencies />} />
            <Route path="/party-performance" element={<PartyPerformance />} />
            <Route path="/party/:partyName" element={<PartyDetail />} />
            <Route path="/district-performance" element={<DistrictPerformance />} />
            <Route path="/constituency/:acNo" element={<ConstituencyDetails />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
