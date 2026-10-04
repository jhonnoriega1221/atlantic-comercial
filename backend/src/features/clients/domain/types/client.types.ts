export interface ClientListItem {
  clientId: string;
  clientName: string;
  transactions: number;
  netSale: number;
}

export interface ClientHistoryItem {
  transactionId: number;
  productId: string;
  productName: string;
  purchaseDate: string;
  cost: number;
}

export interface PaginatedClientsResult {
  data: ClientListItem[];
  total: number;
  page: number;
  lastPage: number;
}

export interface ClientHistoryResult {
  clientId: string;
  clientName: string;
  history: ClientHistoryItem[];
  total: number;
  page: number;
  lastPage: number;
}
