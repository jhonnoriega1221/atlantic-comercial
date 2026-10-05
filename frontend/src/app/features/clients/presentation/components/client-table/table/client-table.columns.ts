import { createColumnHelper, flexRenderComponent } from "@tanstack/angular-table";
import { ClientsTableFeatures } from "./client-table.feature";
import { ClientItem } from "../../../../domain/types/client.types";
import { SortHeader } from "./sort-header";
import { ClientNameCell } from "./client-name-cell";

const cop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
});
const int = new Intl.NumberFormat("es-CO");

const columnHelper = createColumnHelper<ClientsTableFeatures, ClientItem>();

export const columns = columnHelper.columns([
  columnHelper.accessor("clientName", {
    id: "name",
    header: ({ column }) =>
      flexRenderComponent(SortHeader, { inputs: { column, title: "Cliente" } }),
    cell: () => ClientNameCell
  }),
  columnHelper.accessor("transactions", {
    id: "transactions",
    header: ({ column }) =>
      flexRenderComponent(SortHeader, { inputs: { column, title: "Transacciones", align: "end" } }),
    cell: (info) =>
      `<div class="text-right tabular-nums">${int.format(Number(info.getValue()))}</div>`
  }),
  columnHelper.accessor("netSale", {
    id: "netSale",
    header: ({ column }) =>
      flexRenderComponent(SortHeader, { inputs: { column, title: "Venta neta", align: "end" } }),
    cell: (info) =>
      `<div class="text-right font-medium tabular-nums">${cop.format(Number(info.getValue()))}</div>`
  })
]);
