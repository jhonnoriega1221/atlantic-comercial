import { Inject, Injectable } from "@nestjs/common";
import { SalesRepository } from "../../domain/repositories/sales.repository.js";
import { SalesFilterDto } from "../../domain/dto/sales-filter.dto.js";
import { getLastTwoMonthsFilters } from "../../../../shared/utils/period.js";

@Injectable()
export class SalesService {
  constructor(
    @Inject(SalesRepository)
    private readonly salesRepository: SalesRepository
  ) {}

  async getGeneralKPIs(filters: SalesFilterDto) {
    const current = await this.salesRepository.getGeneralKpis(filters);

    const averageOrderValue = current.transactions > 0 ? current.netSale / current.transactions : 0;

    const returnRate =
      current.netSale > 0 ? (Math.abs(current.returns) / current.netSale) * 100 : 0;

    const months = getLastTwoMonthsFilters(filters, await this.salesRepository.getLatestPeriod());
    const [last, previous] = months
      ? await Promise.all([
          this.salesRepository.getGeneralKpis(months.last),
          this.salesRepository.getGeneralKpis(months.previous)
        ])
      : [null, null];

    const salesVariationMoM =
      last && previous && previous.netSale > 0
        ? ((last.netSale - previous.netSale) / previous.netSale) * 100
        : null; // null = no comparable

    return {
      netSale: current.netSale,
      transactions: current.transactions,
      activeClients: current.activeClients,
      averageOrderValue,
      returnRate,
      salesVariationMoM
    };
  }

  async getSalesTrend(filters: SalesFilterDto) {
    return await this.salesRepository.getSalesTrend(filters);
  }

  async getLocationsRanking(filters: SalesFilterDto) {
    const data = await this.salesRepository.getSalesByLocation(filters);

    const totalSales = data.reduce((acc, current) => acc + current.netSale, 0);

    return data.map((item) => ({
      location: item.location,
      netSale: item.netSale,
      participation: totalSales > 0 ? (item.netSale / totalSales) * 100 : 0
    }));
  }
}
