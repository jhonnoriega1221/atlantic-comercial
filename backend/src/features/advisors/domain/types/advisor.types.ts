export interface AdvisorAggregate {
  advisorCode: string;
  advisorName: string;
  location: string;
  netSale: number;
  activeClients: number;
  transactions: number;
}

export interface MonthlyEvolution {
  period: string;
  netSale: number;
  transactions: number;
}
