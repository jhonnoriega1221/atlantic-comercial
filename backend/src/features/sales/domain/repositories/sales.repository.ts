import { SalesFilterDto } from "../dto/sales-filter.dto.js";

export abstract class SalesRepository {
  abstract getGeneralKpis(filters: SalesFilterDto): Promise<{
    netSale: number;
    transactions: number;
    activeClients: number;
    returns: number;
  }>;

  abstract getSalesTrend(filters: SalesFilterDto): Promise<
    Array<{
      period: string;
      netSale: number;
      transactions: number;
    }>
  >;

  abstract getSalesByLocation(filters: SalesFilterDto): Promise<
    Array<{
      location: string;
      netSale: number;
    }>
  >;

  abstract getLatestPeriod(): Promise<string | null>;
}
