import { Component, inject } from "@angular/core";
import { CurrencyPipe, DecimalPipe, PercentPipe } from "@angular/common";

import { SummaryFacade } from "../../facades/summary.facade";
import { DataState } from "../../../../../shared/components/data-state/data-state";
import { KpiCard } from "../../components/kpi-card/kpi-card";
import { NetSalesCard } from "../../components/net-sales-card/net-sales-card";
import { HomeGreeting } from "../../components/home-greeting/home-greeting";
import { SummarySkeleton } from "../../components/summary-skeleton/summary-skeleton";
import { TrendChart } from "../../components/trend-chart/trend-chart";
import { LocationsRanking } from "../../components/locations-ranking/locations-ranking";

@Component({
  selector: "app-summary-page",
  imports: [
    CurrencyPipe,
    DecimalPipe,
    PercentPipe,
    DataState,
    KpiCard,
    NetSalesCard,
    HomeGreeting,
    SummarySkeleton,
    TrendChart,
    LocationsRanking
  ],
  providers: [SummaryFacade],
  templateUrl: "./summary-page.html"
})
export class SummaryPage {
  public readonly facade = inject(SummaryFacade);
}
