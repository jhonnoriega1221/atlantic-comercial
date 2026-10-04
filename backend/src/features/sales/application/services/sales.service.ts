import { Inject, Injectable } from "@nestjs/common";
import { SalesRepository } from "../../domain/repositories/sales.repository.js";
import { SalesFilterDto } from "../../domain/dto/sales-filter.dto.js";
import { calculatePreviousMonthFilter } from "../../../../shared/application/dtos/utils.services.js";

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

    const previousFilter = calculatePreviousMonthFilter(filters);
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

  async getLocationsRanking(filters: SalesFilterDto) {
    const data = await this.salesRepository.getSalesByLocation(filters);

    const totalSales = data.reduce((acc, current) => acc + current.netSale, 0);

    return data.map((item) => ({
      location: item.location,
      netSale: item.netSale,
      participation: totalSales > 0 ? (item.netSale / totalSales) * 100 : 0
    }));
  }

  async getAdvisorsRanking(filters: SalesFilterDto) {
    const currentRanking = await this.salesRepository.getAdvisorsRanking(filters, 10);

    if (currentRanking.length === 0) return [];

    const prevFilters = calculatePreviousMonthFilter(filters);

    const prevData = await this.salesRepository.getAdvisorsRanking(prevFilters, 0);

    return currentRanking.map((current) => {
      const prev = prevData.find((p) => p.advisorCode === current.advisorCode);
      const prevSale = prev ? prev.netSale : 0;

      const salesVariationMoM = prevSale > 0 ? ((current.netSale - prevSale) / prevSale) * 100 : 0;

      const averageTicket = current.transactions > 0 ? current.netSale / current.transactions : 0;

      return {
        advisorCode: current.advisorCode,
        advisorName: current.advisorName,
        netSale: current.netSale,
        activeClients: current.activeClients,
        averageTicket,
        salesVariationMoM
      };
    });
  }
}
