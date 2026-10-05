import { GlobalFilters } from "../../../../shared/utils/global-filters";

export interface ClientItem {
  clientId: string;
  clientName: string;
  transactions: number;
  netSale: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  lastPage: number;
}

export const CLIENT_SORT_FIELDS = ["name", "netSale"] as const;
export type ClientSortField = (typeof CLIENT_SORT_FIELDS)[number];
export type SortOrder = "ASC" | "DESC";
export interface ClientSort {
  sortBy: ClientSortField;
  sortOrder: SortOrder;
}

export interface ClientsFilters extends GlobalFilters {
  page: number;
  limit: number;
  search: string;
  sortBy?: ClientSortField;
  sortOrder: SortOrder;
}
