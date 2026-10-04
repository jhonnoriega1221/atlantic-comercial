import { Component, inject, OnInit } from "@angular/core";
import { CurrencyPipe, DecimalPipe, PercentPipe } from "@angular/common";
import { provideIcons } from "@ng-icons/core";

import { SummaryFacade } from "../../facades/summary.facade";
import { DataState } from "../../../../../shared/components/data-state/data-state";
import { KpiCard } from "../../components/kpi-card/kpi-card";
import { NetSalesCard } from "../../components/net-sales-card/net-sales-card";
import { HomeGreeting } from "../../components/home-greeting/home-greeting";
import { SummarySkeleton } from "../../components/summary-skeleton/summary-skeleton";
import { TrendChart } from "../../components/trend-chart/trend-chart";

@Component({
  selector: "app-summary-page",
  standalone: true,
  imports: [
    CurrencyPipe,
    DecimalPipe,
    PercentPipe,
    DataState,
    KpiCard,
    NetSalesCard,
    HomeGreeting,
    SummarySkeleton,
    TrendChart
  ],
  providers: [provideIcons({})],
  templateUrl: "./summary-page.html"
})
export class SummaryPage implements OnInit {
  public readonly facade = inject(SummaryFacade);

  ngOnInit(): void {
    this.facade.loadDashboard();
  }
}
