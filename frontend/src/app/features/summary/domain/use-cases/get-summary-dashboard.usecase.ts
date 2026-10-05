/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, inject } from "@angular/core";
import { forkJoin } from "rxjs";
import { SummaryRepository } from "../../data/repositories/summary.repository";

@Injectable({ providedIn: "root" })
export class GetSummaryDashboardUseCase {
  private readonly repository = inject(SummaryRepository);

  execute(filters: any = {}) {
    return forkJoin({
      kpis: this.repository.getKpis(filters),
      trend: this.repository.getTrend(filters),
      locations: this.repository.getLocations(filters)
    });
  }
}
