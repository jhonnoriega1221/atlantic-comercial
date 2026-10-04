import { SalesFilterDto } from "../dto/sales-filter.dto.js";

export const I_SALES_REPOSITORY = "ISalesRepository";

export interface ISalesRepository {
  getGeneralKpis(filters: SalesFilterDto): Promise<{
    netSale: number;
    transactions: number;
    activeClients: number;
    returns: number;
  }>;

  getSalesTrend(filters: SalesFilterDto): Promise<
    Array<{
      period: string;
      netSale: number;
      transactions: number;
    }>
  >;

  getSalesByLocation(filters: SalesFilterDto): Promise<
    Array<{
      location: string;
      netSale: number;
    }>
  >;

  getAdvisorsRanking(
    filters: SalesFilterDto,
    limit?: number
  ): Promise<
    Array<{
      advisorCode: string;
      advisorName: string;
      netSale: number;
      activeClients: number;
      transactions: number;
    }>
  >;
}
