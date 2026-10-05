import { GlobalFilterDto } from "./global-filter.dto.js";

// Suma meses a una fecha ISO y devuelve el inicio de ese mes: ("2026-06-15", -1) -> "2026-05-01"
export function addMonths(iso: string, delta: number): string {
  const [year, month] = iso.slice(0, 7).split("-").map(Number);
  return new Date(Date.UTC(year, month - 1 + delta, 1)).toISOString().slice(0, 10);
}

// Último mes del rango y el mes previo, conservando el resto de filtros (sede, asesor...)
export function getLastTwoMonthsFilters(
  filters: GlobalFilterDto,
  latestPeriod: string | null
): { last: GlobalFilterDto; previous: GlobalFilterDto } | null {
  const reference = filters.endDate ?? latestPeriod;
  if (!reference) return null; // base vacía: nada que comparar

  const lastMonth = addMonths(reference, 0);
  const previousMonth = addMonths(reference, -1);

  return {
    last: { ...filters, startDate: lastMonth, endDate: lastMonth },
    previous: { ...filters, startDate: previousMonth, endDate: previousMonth }
  };
}
