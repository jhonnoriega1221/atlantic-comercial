import { Component, inject } from "@angular/core";
import { PurchaseHistoryTable } from "../../components/purchase-history-table/purchase-history-table";
import { DataState } from "../../../../../shared/components/data-state/data-state";
import { HlmButtonImports } from "@spartan-ng/helm/button";
import { NgIcon } from "@ng-icons/core";
import { ClientDetailsFacade } from "../../facade/client-details.facade";
import { Location } from "@angular/common";

@Component({
  selector: "app-client-details-page",
  imports: [PurchaseHistoryTable, DataState, HlmButtonImports, NgIcon],
  providers: [ClientDetailsFacade],
  templateUrl: "./client-details-page.html"
})
export class ClientDetailsPage {
  protected readonly facade = inject(ClientDetailsFacade);
  private readonly location = inject(Location);

  back() {
    this.location.back();
  }
}
