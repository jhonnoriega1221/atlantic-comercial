export interface PurchaseItem {
  transactionId: number;
  productId: string;
  productName: string;
  purchaseDate: string; // 2026-06-01 solo importa el mes y el año
  cost: number;
}

export interface ClientHistory {
  clientId: string;
  clientName: string;
  history: PurchaseItem[];
  total: number;
  page: number;
  lastPage: number;
}

export interface HistoryFilters {
  page: number;
  limit: number;
}
