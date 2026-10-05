export interface AdvisorRankingItem {
  advisorCode: string;
  advisorName: string;
  location: string;
  netSale: number;
  activeClients: number;
  averageTicket: number;
  salesVariationMoM: number | null;
}

export interface LocationRanking {
  location: string;
  totalSales: number;
  advisors: AdvisorRankingItem[];
}
