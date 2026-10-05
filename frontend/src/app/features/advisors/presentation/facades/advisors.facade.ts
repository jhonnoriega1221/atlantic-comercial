import { computed, inject, Injectable } from "@angular/core";
import { LocationRanking } from "../../domain/types/advisor.types";
import { GetAdvisorsRankingUseCase } from "../../domain/use-cases/get-advisors-ranking.usecase";
import { BehaviorSubject, catchError, map, of, startWith, switchMap } from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";

interface RankingState {
  data: LocationRanking[];
  loading: boolean;
  error: Error | null;
}

@Injectable()
export class AdvisorsFacade {
  private readonly getRanking = inject(GetAdvisorsRankingUseCase);
  private readonly retry$ = new BehaviorSubject<void>(undefined);

  private readonly state = toSignal(
    this.retry$.pipe(
      switchMap(() =>
        this.getRanking.execute().pipe(
          map((data): RankingState => ({ data, loading: false, error: null })),
          catchError((error: Error) => of<RankingState>({ data: [], loading: false, error })),
          startWith<RankingState>({ data: [], loading: true, error: null })
        )
      )
    ),
    { initialValue: { data: [], loading: true, error: null } as RankingState }
  );

  readonly rankings = computed(() => this.state().data);
  readonly isLoading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);

  readonly maxSales = computed(() =>
    Math.max(0, ...this.rankings().flatMap((r) => r.advisors.map((a) => a.netSale)))
  );

  retry() {
    this.retry$.next();
  }
}
