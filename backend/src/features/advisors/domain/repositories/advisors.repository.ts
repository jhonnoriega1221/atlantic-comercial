import { AdvisorFilterDto } from "../dto/advisor-filter.dto.js";
import { AdvisorAggregate, MonthlyEvolution } from "../types/advisor.types.js";

export abstract class AdvisorsRepository {
  abstract getRanking(filters: AdvisorFilterDto): Promise<AdvisorAggregate[]>;
  abstract getMonthlyEvolution(filters: AdvisorFilterDto): Promise<MonthlyEvolution[]>;
}
