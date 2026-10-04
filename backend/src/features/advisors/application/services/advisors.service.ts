import { Injectable } from "@nestjs/common";
import { AdvisorsRepository } from "../../domain/repositories/advisors.repository.js";
import { AdvisorRankingDto } from "../../domain/dto/advisor-ranking.dto.js";
import { MonthlyEvolution } from "../../domain/types/advisor.types.js";
import { calculatePreviousMonthFilter } from "../../../../shared/application/dtos/utils.services.js";
import { AdvisorFilterDto } from "../../domain/dto/advisor-filter.dto.js";

@Injectable()
export class AdvisorsService {
  constructor(private readonly advisorsRepository: AdvisorsRepository) {}

  async getRanking(filters: AdvisorFilterDto): Promise<AdvisorRankingDto[]> {
    const current = await this.advisorsRepository.getRanking(filters);
    if (current.length === 0) return [];

    const previous = await this.advisorsRepository.getRanking(
      calculatePreviousMonthFilter(filters)
    );
    const previousSales = new Map(
      previous.map((p) => [`${p.advisorCode}|${p.location}`, p.netSale])
    );

    return current.map((c) => {
      const prevSale = previousSales.get(`${c.advisorCode}|${c.location}`) ?? 0;
      return {
        advisorCode: c.advisorCode,
        advisorName: c.advisorName,
        location: c.location,
        netSale: c.netSale,
        activeClients: c.activeClients,
        averageTicket: c.transactions > 0 ? c.netSale / c.transactions : 0,
        salesVariationMoM: prevSale > 0 ? ((c.netSale - prevSale) / prevSale) * 100 : 0
      };
    });
  }

  getEvolution(advisorCode: string, filters: AdvisorFilterDto): Promise<MonthlyEvolution[]> {
    // El código de la ruta manda sobre cualquier `advisor` que venga en el query
    return this.advisorsRepository.getMonthlyEvolution({ ...filters, advisor: advisorCode });
  }
}
