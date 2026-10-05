import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AdvisorAggregate, MonthlyEvolution } from "../../domain/types/advisor.types.js";
import { Repository } from "typeorm";
import { AggregatedSalesEntity } from "../../../sales/domain/entities/aggregated-sales.entity.js";
import { AdvisorsRepository } from "../../domain/repositories/advisors.repository.js";
import { applySalesFilters } from "../../../../shared/utils/global-filter.utils.js";
import { AdvisorFilterDto } from "../../domain/dto/advisor-filter.dto.js";

@Injectable()
export class TypeOrmAdvisorsRepository implements AdvisorsRepository {
  constructor(
    @InjectRepository(AggregatedSalesEntity)
    private readonly repository: Repository<AggregatedSalesEntity>
  ) {}

  async getRanking(filters: AdvisorFilterDto): Promise<AdvisorAggregate[]> {
    const qb = this.repository.createQueryBuilder("v");
    applySalesFilters(qb, filters);

    qb.select("v.advisorCode", "advisorCode")
      .addSelect("v.advisorName", "advisorName")
      .addSelect("v.location", "location")
      .addSelect("SUM(v.netSale)", "netSale")
      .addSelect("AVG(v.activeClients)", "activeClients") // Clientes promedio
      .addSelect("SUM(v.transactions)", "transactions")
      .groupBy("v.advisorCode")
      .addGroupBy("v.advisorName")
      .addGroupBy("v.location")
      .orderBy("netSale", "DESC");

    const rows = await qb.getRawMany();
    return rows.map((row) => ({
      advisorCode: row.advisorCode,
      advisorName: row.advisorName,
      location: row.location,
      netSale: Number(row.netSale) || 0,
      activeClients: Math.round(Number(row.activeClients)) || 0,
      transactions: Number(row.transactions) || 0
    }));
  }

  async getMonthlyEvolution(filters: AdvisorFilterDto): Promise<MonthlyEvolution[]> {
    const qb = this.repository.createQueryBuilder("v");
    applySalesFilters(qb, filters);

    qb.select("v.period", "period")
      .addSelect("SUM(v.netSale)", "netSale")
      .addSelect("SUM(v.transactions)", "transactions")
      .groupBy("v.period")
      .orderBy("v.period", "ASC");

    const rows = await qb.getRawMany();
    return rows.map((row) => ({
      period: row.period,
      netSale: Number(row.netSale) || 0,
      transactions: Number(row.transactions) || 0
    }));
  }

  async getLatestPeriod(): Promise<string | null> {
    const row = await this.repository
      .createQueryBuilder("v")
      .select("MAX(v.period)", "latest")
      .getRawOne();
    return row?.latest ?? null; // "2026-06-01"
  }
}
