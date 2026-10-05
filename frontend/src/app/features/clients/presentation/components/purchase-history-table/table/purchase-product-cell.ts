import { Component, input } from "@angular/core";
import { Row } from "@tanstack/angular-table";
import { PurchaseTableFeatures } from "./purcharse-history-table.features";
import { PurchaseItem } from "../../../../domain/types/client-history.types";

@Component({
  selector: "app-purchase-product-cell",
  host: { class: "block min-w-48" },
  template: `
    <div class="font-medium">{{ row().original.productName }}</div>
    <div class="text-muted-foreground text-xs">
      Producto {{ row().original.productId }} · Transacción {{ row().original.transactionId }}
    </div>
  `
})
export class PurchaseProductCell {
  readonly row = input.required<Row<PurchaseTableFeatures, PurchaseItem>>();
}
