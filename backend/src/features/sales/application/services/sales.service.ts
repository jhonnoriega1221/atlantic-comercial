import { Inject, Injectable } from "@nestjs/common";
import { I_SALES_REPOSITORY } from "../../domain/repositories/sales.repository.js";
import type { ISalesRepository } from "../../domain/repositories/sales.repository.js";
import { SalesFilterDto } from "../../domain/dto/sales-filter.dto.js";

@Injectable()
export class SalesService {
  constructor(
    @Inject(I_SALES_REPOSITORY)
    private readonly salesRepository: ISalesRepository
  ) {}

  async getGeneralKPIs(filters: SalesFilterDto) {
    const current = await this.salesRepository.getGeneralKpis(filters);

    const averageOrderValue = current.transactions > 0 ? current.netSale / current.transactions : 0;

    const returnRate =
      current.netSale > 0 ? (Math.abs(current.returns) / current.netSale) * 100 : 0;

    const previousFilter = this.calculatePreviousMonthFilter(filters);
    const previous = await this.salesRepository.getGeneralKpis(previousFilter);

    const salesGrowthRate =
      previous.netSale > 0 ? ((current.netSale - previous.netSale) / previous.netSale) * 100 : 0;

    return {
      netSale: current.netSale,
      transactions: current.transactions,
      activeClients: current.activeClients,
      averageOrderValue,
      returnRate,
      salesVariationMoM: salesGrowthRate
    };
  }

  async getSalesTrend(filters: SalesFilterDto) {
    return await this.salesRepository.getSalesTrend(filters);
  }

  private calculatePreviousMonthFilter(filters: SalesFilterDto): SalesFilterDto {
    const previousFilter = { ...filters };

    if (filters.startDate) {
      const date = new Date(filters.startDate);
      date.setMonth(date.getMonth() - 1);
      previousFilter.startDate = date.toISOString().split("T")[0];
    }

    if (filters.endDate) {
      const date = new Date(filters.endDate);
      date.setMonth(date.getMonth() - 1);
      previousFilter.endDate = date.toISOString().split("T")[0];
    }

    return previousFilter;
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
