import { InjectRepository } from "@nestjs/typeorm";
import { ISalesRepository } from "../../domain/repositories/sales.repository.js";
import { AggregatedSalesEntity } from "../../domain/entities/aggregated-sales.entity.js";
import { Repository } from "typeorm";
import { SalesFilterDto } from "../../domain/dto/sales-filter.dto.js";
import { SelectQueryBuilder } from "typeorm/browser";

export class SalesRepository implements ISalesRepository {
  constructor(
    @InjectRepository(AggregatedSalesEntity)
    private readonly repository: Repository<AggregatedSalesEntity>
  ) {}

  private applyFilters(qb: SelectQueryBuilder<AggregatedSalesEntity>, filters: SalesFilterDto) {
    if (filters.startDate) {
      qb.andWhere("v.period >= :startDate", { startDate: filters.startDate });
    }

    if (filters.endDate) {
      qb.andWhere("v.period <= :endDate", { endDate: filters.endDate });
    }

    if (filters.location) {
      qb.andWhere("v.location = :location", { location: filters.location.toUpperCase() });
    }

    if (filters.advisor) {
      qb.andWhere("v.advisorCode = :advisor", { advisor: filters.advisor });
    }
  }

  async getGeneralKpis(filters: SalesFilterDto) {
    const qb = this.repository.createQueryBuilder("v");
    this.applyFilters(qb, filters);

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
    this.applyFilters(qb, filters);

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
    this.applyFilters(qb, filters);

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

  async getAdvisorsRanking(filters: SalesFilterDto, limit: number = 10) {
    const qb = this.repository.createQueryBuilder("v");
    this.applyFilters(qb, filters);

    qb.select("v.advisorCode", "advisorCode")
      .addSelect("v.advisorName", "advisorName")
      .addSelect("SUM(v.netSale)", "netSale")
      .addSelect("SUM(v.activeClients)", "activeClients")
      .addSelect("SUM(v.transactions)", "transactions")
      .groupBy("v.advisorCode")
      .addGroupBy("v.advisorName")
      .orderBy("netSale", "DESC");

    if (limit > 0) {
      qb.limit(limit);
    }

    const result = await qb.getRawMany();

    return result.map((row) => ({
      advisorCode: row.advisorCode,
      advisorName: row.advisorName,
      netSale: Number(row.netSale) || 0,
      activeClients: Number(row.activeClients) || 0,
      transactions: Number(row.transactions) || 0
    }));
  }
}
