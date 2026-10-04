export interface KpisResult {
  result: string;
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
