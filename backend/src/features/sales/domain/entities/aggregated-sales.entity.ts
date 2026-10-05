import { ViewEntity, PrimaryColumn, Column } from "typeorm";

@ViewEntity({
  name: "agg_ventas_mensual",
  synchronize: false
})
export class AggregatedSalesEntity {
  @PrimaryColumn({ name: "Periodo" })
  period: string;

  @PrimaryColumn({ name: "Cod Asesor" })
  advisorCode: string;

  @Column({ name: "Sede" })
  location: string;

  @Column({ name: "Nombre Asesor" })
  advisorName: string;

  @Column({ name: "Transacciones" })
  transactions: number;

  @Column({ name: "Clientes_Activos" })
  activeClients: number;

  @Column({ name: "Venta_Neta" })
  netSale: number;

  @Column({ name: "Devoluciones" })
  returns: number;
}
