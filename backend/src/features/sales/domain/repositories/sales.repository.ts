import { SalesFilterDto } from "../dto/sales-filter.dto.js";

export const I_SALES_REPOSITORY = "ISalesRepository";

export interface ISalesRepository {
  getAggregated(filters: SalesFilterDto): Promise<{
    netSale: number;
    transactions: number;
    activeClients: number;
    returns: number;
  }>;
}
