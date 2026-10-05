import { Component, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { TrendChart } from "../../../../summary/presentation/components/trend-chart/trend-chart";
import { KpiCard } from "../../../../summary/presentation/components/kpi-card/kpi-card";
import { DataState } from "../../../../../shared/components/data-state/data-state";
import { HlmButtonImports } from "@spartan-ng/helm/button";
import { NgIcon } from "@ng-icons/core";
import { AdvisorDetailsFacade } from "../../facades/advisor-details.facade";
import {
  cop,
  displayLocation,
  formatMillions,
  formatPercent,
  int
} from "../../../../../shared/utils/format";
import { Location } from "@angular/common";

@Component({
  selector: "app-advisor-details-page",
  imports: [RouterLink, TrendChart, KpiCard, DataState, HlmButtonImports, NgIcon],
  providers: [AdvisorDetailsFacade],
  templateUrl: "./advisor-details-page.html"
})
export class AdvisorDetailsPage {
  protected readonly facade = inject(AdvisorDetailsFacade);
  private readonly location = inject(Location);
  private readonly router = inject(Router);

  protected readonly displayLocation = displayLocation;
  protected readonly formatMillions = formatMillions;
  protected readonly formatPercent = formatPercent;
  protected readonly cop = cop;
  protected readonly int = int;

  back() {
    this.location.back();
  }
}
