import { Component, input } from "@angular/core";
import { NgIcon } from "@ng-icons/core";
import { CurrencyPipe, PercentPipe, NgClass } from "@angular/common";
import { KpisResult } from "../../../domain/types/summary.types";

@Component({
  imports: [NgIcon, CurrencyPipe, PercentPipe, NgClass],
  selector: "app-net-sales-card",
  styleUrl: "./net-sales-card.css",
  templateUrl: "./net-sales-card.html"
})
export class NetSalesCard {
  kpis = input.required<KpisResult>();
}
