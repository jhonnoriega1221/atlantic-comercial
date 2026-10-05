import { GlobalFilters } from "./global-filters.types";

export function toGlobalParams(f: GlobalFilters): Record<string, string> {
  const params: Record<string, string> = {};
  if (f.startDate) params["startDate"] = f.startDate;
  if (f.endDate) params["endDate"] = f.endDate;
  if (f.location) params["location"] = f.location;
  if (f.advisor) params["advisor"] = f.advisor;
  return params;
}

export const pickDateRange = (f: GlobalFilters): GlobalFilters => ({
  startDate: f.startDate,
  endDate: f.endDate
});

export const sameDateRange = (a: GlobalFilters, b: GlobalFilters) =>
  a.startDate === b.startDate && a.endDate === b.endDate;
