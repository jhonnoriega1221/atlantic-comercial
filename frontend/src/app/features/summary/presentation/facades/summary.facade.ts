import { DestroyRef, Injectable, effect, inject, signal, untracked } from "@angular/core";
import { Subscription, finalize } from "rxjs";
import { GetSummaryDashboardUseCase } from "../../domain/use-cases/get-summary-dashboard.usecase";
import { KpisResult, LocationItem, TrendItem } from "../../domain/types/summary.types";
import { GlobalFilters } from "../../../../shared/global-filters/global-filters.types";
import { GlobalFiltersStore } from "../../../../shared/global-filters/global-filters.store";

@Injectable()
export class SummaryFacade {
  private readonly getSummaryDashboard = inject(GetSummaryDashboardUseCase);
  private readonly globalFilters = inject(GlobalFiltersStore);

  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly kpis = signal<KpisResult | null>(null);
  readonly trend = signal<TrendItem[]>([]);
  readonly locations = signal<LocationItem[]>([]);

  private request?: Subscription;

  constructor() {
    effect(() => {
      const filters = this.globalFilters.filters();
      untracked(() => this.loadDashboard(filters));
    });

    inject(DestroyRef).onDestroy(() => this.request?.unsubscribe());
  }

  loadDashboard(filters: GlobalFilters = this.globalFilters.filters()): void {
    this.request?.unsubscribe();

    this.isLoading.set(true);
    this.error.set(null);

    this.request = this.getSummaryDashboard
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
