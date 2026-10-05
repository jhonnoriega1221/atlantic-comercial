import { createColumnHelper } from "@tanstack/angular-table";
import { PurchaseTableFeatures } from "./purcharse-history-table.features";
import { PurchaseItem } from "../../../../domain/types/client-history.types";
import { PurchaseProductCell } from "./purchase-product-cell";

const cop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
});
const monthFormatter = new Intl.DateTimeFormat("es-CO", { month: "long", year: "numeric" });

// Se elimina el día de la fecha, ya que este no es real y solo se deja mes y año ej. "2026-06-01" -> "Junio de 2026"
const formatMonth = (period: string) => {
  const text = monthFormatter.format(new Date(`${period}T00:00:00`));
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const columnHelper = createColumnHelper<PurchaseTableFeatures, PurchaseItem>();

export const columns = columnHelper.columns([
  columnHelper.accessor("productName", {
    id: "product",
    header: "Producto",
    cell: () => PurchaseProductCell
  }),
  columnHelper.accessor("purchaseDate", {
    id: "month",
    header: "Mes de compra",
    cell: (info) => `<span class="whitespace-nowrap">${formatMonth(String(info.getValue()))}</span>`
  }),
  columnHelper.accessor("cost", {
    id: "cost",
    header: '<div class="text-right">Costo</div>',
    cell: (info) =>
      `<div class="text-right font-medium tabular-nums">${cop.format(Number(info.getValue()))}</div>`
  })
]);
