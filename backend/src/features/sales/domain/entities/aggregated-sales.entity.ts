import { ViewEntity, ViewColumn } from "typeorm";

@ViewEntity({
  name: "view_ventas_agregadas",
  synchronize: false
})
export class AggregatedSalesEntity {
  @ViewColumn({ name: "Periodo" })
  period: string;

  @ViewColumn({ name: "Sede" })
  location: string;

  @ViewColumn({ name: "Cod Asesor" })
  advisorCode: string;

  @ViewColumn({ name: "Nombre Asesor" })
  advisorName: string;

  @ViewColumn({ name: "Transacciones" })
  transactions: number;

  @ViewColumn({ name: "Clientes_Activos" })
  activeClients: number;

  @ViewColumn({ name: "Venta_Neta" })
  netSale: number;

  @ViewColumn({ name: "Devoluciones" })
  returns: number;
}
