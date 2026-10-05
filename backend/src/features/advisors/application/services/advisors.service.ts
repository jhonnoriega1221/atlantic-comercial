import { Injectable } from "@nestjs/common";
import { AdvisorsRepository } from "../../domain/repositories/advisors.repository.js";
import { AdvisorRankingDto } from "../../domain/dto/advisor-ranking.dto.js";
import { MonthlyEvolution } from "../../domain/types/advisor.types.js";
import { AdvisorFilterDto } from "../../domain/dto/advisor-filter.dto.js";
import { getLastTwoMonthsFilters } from "../../../../shared/utils/period.js";

@Injectable()
export class AdvisorsService {
  constructor(private readonly advisorsRepository: AdvisorsRepository) {}

  async getRanking(filters: AdvisorFilterDto): Promise<AdvisorRankingDto[]> {
    const current = await this.advisorsRepository.getRanking(filters);
    if (current.length === 0) return [];

    const months = getLastTwoMonthsFilters(
      filters,
      await this.advisorsRepository.getLatestPeriod()
    );
    const [lastMonth, previousMonth] = months
      ? await Promise.all([
          this.advisorsRepository.getRanking(months.last),
          this.advisorsRepository.getRanking(months.previous)
        ])
      : [[], []];

    const key = (a: { advisorCode: string; location: string }) => `${a.advisorCode}|${a.location}`;
    const lastSales = new Map(lastMonth.map((a) => [key(a), a.netSale]));
    const previousSales = new Map(previousMonth.map((a) => [key(a), a.netSale]));

    return current.map((c) => {
      const last = lastSales.get(key(c)) ?? 0;
      const prev = previousSales.get(key(c)) ?? 0;
      return {
        advisorCode: c.advisorCode,
        advisorName: c.advisorName,
        location: c.location,
        netSale: c.netSale,
        activeClients: c.activeClients,
        averageTicket: c.transactions > 0 ? c.netSale / c.transactions : 0,
        salesVariationMoM: prev > 0 ? ((last - prev) / prev) * 100 : null
      };
    });
  }

  getEvolution(advisorCode: string, filters: AdvisorFilterDto): Promise<MonthlyEvolution[]> {
    // El código de la ruta manda sobre cualquier `advisor` que venga en el query
    return this.advisorsRepository.getMonthlyEvolution({ ...filters, advisor: advisorCode });
  }
}
