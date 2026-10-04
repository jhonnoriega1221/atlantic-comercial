import { ViewEntity, ViewColumn } from "typeorm";

@ViewEntity({
  name: "view_clientes_resumen",
  synchronize: false
})
export class ClientSummaryEntity {
  @ViewColumn({ name: "Cod Cliente" })
  clientId: string;

  @ViewColumn({ name: "Nombre Cliente" })
  clientName: string;

  @ViewColumn({ name: "Transacciones" })
  transactions: number;

  @ViewColumn({ name: "Venta_Neta" })
  netSale: number;
}
