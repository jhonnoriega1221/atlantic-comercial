import { Component, input } from "@angular/core";
import { NgIcon } from "@ng-icons/core";

@Component({
  imports: [NgIcon],
  selector: "app-kpi-card",
  styleUrl: "./kpi-card.css",
  templateUrl: "./kpi-card.html"
})
export class KpiCard {
  title = input.required<string>();
  icon = input.required<string>();
  description = input.required<string>();
  value = input.required<string>();
}
