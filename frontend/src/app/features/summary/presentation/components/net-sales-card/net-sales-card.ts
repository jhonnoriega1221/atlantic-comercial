import { Component, input } from "@angular/core";
import { NgIcon } from "@ng-icons/core";
import { CurrencyPipe, PercentPipe, NgClass } from "@angular/common";

@Component({
  imports: [NgIcon, CurrencyPipe, PercentPipe, NgClass],
  selector: "app-net-sales-card",
  styleUrl: "./net-sales-card.css",
  templateUrl: "./net-sales-card.html"
})
export class NetSalesCard {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  kpis = input.required<any>();
}
