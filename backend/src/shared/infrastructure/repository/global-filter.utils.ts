import { SelectQueryBuilder } from "typeorm";
import { AggregatedSalesEntity } from "../../../features/sales/domain/entities/aggregated-sales.entity.js";
import { GlobalFilterDto } from "../../application/dtos/global-filter.dto.js";

export function applySalesFilters(
  qb: SelectQueryBuilder<AggregatedSalesEntity>,
  filters: GlobalFilterDto
) {
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
