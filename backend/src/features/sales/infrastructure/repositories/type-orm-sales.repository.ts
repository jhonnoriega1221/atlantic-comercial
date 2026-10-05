import { InjectRepository } from "@nestjs/typeorm";
import { AggregatedSalesEntity } from "../../domain/entities/aggregated-sales.entity.js";
import { Repository } from "typeorm";
import { SalesFilterDto } from "../../domain/dto/sales-filter.dto.js";
import { applySalesFilters } from "../../../../shared/utils/global-filter.utils.js";

export class TypeOrmSalesRepository implements TypeOrmSalesRepository {
  constructor(
    @InjectRepository(AggregatedSalesEntity)
    private readonly repository: Repository<AggregatedSalesEntity>
  ) {}

  async getGeneralKpis(filters: SalesFilterDto) {
    const qb = this.repository.createQueryBuilder("v");
    applySalesFilters(qb, filters);

    const result = await qb
      .select("SUM(v.netSale)", "netSale")
      .addSelect("SUM(v.transactions)", "transactions")
      .addSelect("SUM(v.activeClients)", "activeClients")
      .addSelect("SUM(v.returns)", "returns")
      .getRawOne();

    return {
      netSale: Number(result.netSale) || 0,
      transactions: Number(result.transactions) || 0,
      activeClients: Number(result.activeClients) || 0,
      returns: Number(result.returns) || 0
    };
  }

  async getSalesTrend(filters: SalesFilterDto) {
    const qb = this.repository.createQueryBuilder("v");
    applySalesFilters(qb, filters);

    const result = await qb
      .select("v.period", "period")
      .addSelect("SUM(v.netSale)", "netSale")
      .addSelect("SUM(v.transactions)", "transactions")
      .groupBy("v.period")
      .orderBy("v.period", "ASC")
      .getRawMany();

    return result.map((row) => ({
      period: row.period,
      netSale: Number(row.netSale) || 0,
      transactions: Number(row.transactions) || 0
    }));
  }

  async getSalesByLocation(filters: SalesFilterDto) {
    const qb = this.repository.createQueryBuilder("v");
    applySalesFilters(qb, filters);

    const result = await qb
      .select("v.location", "location")
      .addSelect("SUM(v.netSale)", "netSale")
      .groupBy("v.location")
      .orderBy("netSale", "DESC")
      .getRawMany();

    return result.map((row) => ({
      location: row.location,
      netSale: Number(row.netSale) || 0
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
