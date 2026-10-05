import { Component, inject } from "@angular/core";
import { LocationRankingCard } from "../../components/location-ranking-card/location-ranking-card";
import { DataState } from "../../../../../shared/components/data-state/data-state";
import { AdvisorsFacade } from "../../facades/advisors.facade";

@Component({
  selector: "app-advisors-page",
  imports: [LocationRankingCard, DataState],
  providers: [AdvisorsFacade],
  templateUrl: "./advisors-page.html"
})
export class AdvisorsPage {
  protected readonly facade = inject(AdvisorsFacade);
}
