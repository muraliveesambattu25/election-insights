export interface Candidate {
  Rank: number;
  Name: string;
  Party: string;
  Votes_Secured: number;
  Source_Citations: string;
}

export interface CandidateDetails {
  Name: string;
  Party: string;
  Votes_Secured: number;
}

export interface ConstituencyData {
  AC_No: number;
  Constituency_Name: string;
  District: string;
  Total_Electors: number;
  Polling_Percentage: string;
  NOTA_Votes: number;
  Winner_Details: CandidateDetails;
  Runner_up_Details: CandidateDetails;
  Winning_Margin: number;
  Top_5_Candidates: Candidate[];
}

export interface ElectionData {
  AndhraPradeshAssemblyElections2024: ConstituencyData[];
}
