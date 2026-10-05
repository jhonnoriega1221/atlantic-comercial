import { Component, input } from "@angular/core";
import { LocationRanking } from "../../../domain/types/advisor.types";
import { RouterLink } from "@angular/router";
import {
  cop,
  displayLocation,
  formatMillions,
  formatPercent,
  int
} from "../../../../../shared/utils/format";

@Component({
  selector: "app-location-ranking-card",
  imports: [RouterLink],
  templateUrl: "./location-ranking-card.html"
})
export class LocationRankingCard {
  readonly ranking = input.required<LocationRanking>();
  readonly maxSales = input.required<number>();

  protected readonly displayLocation = displayLocation;
  protected readonly formatMillions = formatMillions;
  protected readonly formatPercent = formatPercent;
  protected readonly cop = cop;
  protected readonly int = int;

  protected barWidth(netSale: number) {
    return this.maxSales() > 0 ? (netSale / this.maxSales()) * 100 : 0;
  }
}
