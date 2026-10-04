import { GlobalFilterDto } from "./global-filter.dto.js";

export function calculatePreviousMonthFilter(filters: GlobalFilterDto): GlobalFilterDto {
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
