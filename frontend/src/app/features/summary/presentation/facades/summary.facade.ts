/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, inject, signal } from "@angular/core";
import { GetSummaryDashboardUseCase } from "../../domain/use-cases/get-summary-dashboard.usecase";
import { finalize } from "rxjs";
import { KpisResult, LocationItem, TrendItem } from "../../domain/types/summary.types";

@Injectable({ providedIn: "root" })
export class SummaryFacade {
  private readonly getSummaryDashboard = inject(GetSummaryDashboardUseCase);

  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly kpis = signal<KpisResult | null>(null);
  readonly trend = signal<TrendItem[]>([]);
  readonly locations = signal<LocationItem[]>([]);

  loadDashboard(filters: any = {}): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.getSummaryDashboard
      .execute(filters)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data) => {
          this.kpis.set(data.kpis);
          this.trend.set(data.trend);
          this.locations.set(data.locations);
        },
        error: (err) => {
          this.error.set(err.message);
          this.kpis.set(null);
        }
      });
  }
}
