export interface KpisResult {
  netSale: number;
  transactions: number;
  activeClients: number;
  averageOrderValue: number;
  returnRate: number;
  salesVariationMoM: number | null;
}

export interface TrendItem {
  period: string;
  netSale: number;
  transactions: number;
}

export interface LocationItem {
  location: string;
  netSale: number;
  participation: number;
}
