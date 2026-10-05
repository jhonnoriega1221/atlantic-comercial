import { computed, inject, Injectable } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  map,
  of,
  scan,
  startWith,
  switchMap
} from "rxjs";
import { LocationRanking } from "../../domain/types/advisor.types";
import { GetAdvisorsRankingUseCase } from "../../domain/use-cases/get-advisors-ranking.usecase";
import { GlobalFiltersStore } from "../../../../shared/global-filters/global-filters.store";

interface RankingState {
  data: LocationRanking[] | null;
  loading: boolean;
  error: Error | null;
}

const INITIAL_STATE: RankingState = { data: null, loading: true, error: null };

@Injectable()
export class AdvisorsFacade {
  private readonly getRanking = inject(GetAdvisorsRankingUseCase);
  private readonly globalFilters = inject(GlobalFiltersStore);
  private readonly retry$ = new BehaviorSubject<void>(undefined);

  private readonly state = toSignal(
    combineLatest([toObservable(this.globalFilters.filters), this.retry$]).pipe(
      switchMap(([filters]) =>
        this.getRanking.execute(filters).pipe(
          map((data): Partial<RankingState> => ({ data, loading: false, error: null })),
          catchError((error: Error) =>
            of<Partial<RankingState>>({ data: null, loading: false, error })
          ),
          startWith<Partial<RankingState>>({ loading: true, error: null })
        )
      ),
      scan<Partial<RankingState>, RankingState>(
        (state, patch) => ({ ...state, ...patch }),
        INITIAL_STATE
      )
    ),
    { initialValue: INITIAL_STATE }
  );

  readonly rankings = computed(() => this.state().data ?? []);
  readonly isLoading = computed(() => this.state().loading && this.state().data === null);
  readonly isRefreshing = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly hasActiveFilters = computed(() => this.globalFilters.activeCount() > 0);

  readonly maxSales = computed(() =>
    Math.max(0, ...this.rankings().flatMap((r) => r.advisors.map((a) => a.netSale)))
  );

  retry() {
    this.retry$.next();
  }
}
