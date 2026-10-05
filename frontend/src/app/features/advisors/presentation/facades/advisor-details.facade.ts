import { computed, inject, Injectable } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, combineLatest, map } from "rxjs";
import { GetAdvisorUseCase } from "../../domain/use-cases/get-advisor.usecase";
import { GetAdvisorEvolutionUseCase } from "../../domain/use-cases/get-advisor-evolution.usecase";
import { GetAdvisorTopClientsUseCase } from "../../domain/use-cases/get-advisor-top-clients.usecase";
import { initialRequestState, switchToRequestState } from "../../../../shared/utils/request-state";
import { AdvisorRankingItem } from "../../domain/types/advisor.types";
import { TrendItem } from "../../../summary/domain/types/summary.types";
import { ClientItem } from "../../../clients/domain/types/client.types";
import { GlobalFiltersStore } from "../../../../shared/global-filters/global-filters.store";
import {
  pickDateRange,
  sameDateRange
} from "../../../../shared/global-filters/global-filters.params";

@Injectable()
export class AdvisorDetailsFacade {
  private readonly route = inject(ActivatedRoute);
  private readonly global = inject(GlobalFiltersStore);
  private readonly getAdvisor = inject(GetAdvisorUseCase);
  private readonly getEvolution = inject(GetAdvisorEvolutionUseCase);
  private readonly getTopClients = inject(GetAdvisorTopClientsUseCase);

  readonly code = toSignal(this.route.paramMap.pipe(map((p) => p.get("id") ?? "")), {
    initialValue: this.route.snapshot.paramMap.get("id") ?? ""
  });

  private readonly dateRange = computed(() => pickDateRange(this.global.filters()), {
    equal: sameDateRange
  });

  readonly hasDateRange = computed(
    () => !!this.dateRange().startDate || !!this.dateRange().endDate
  );

  private readonly retry$ = new BehaviorSubject<void>(undefined);

  private readonly request$ = combineLatest([
    toObservable(this.code),
    toObservable(this.dateRange),
    this.retry$
  ]).pipe(map(([code, range]) => ({ code, range })));

  readonly advisor = toSignal(
    switchToRequestState(this.request$, ({ code, range }) => this.getAdvisor.execute(code, range)),
    { initialValue: initialRequestState<AdvisorRankingItem | null>() }
  );

  readonly evolution = toSignal(
    switchToRequestState(this.request$, ({ code, range }) =>
      this.getEvolution.execute(code, range)
    ),
    { initialValue: initialRequestState<TrendItem[]>() }
  );

  readonly topClients = toSignal(
    switchToRequestState(this.request$, ({ code, range }) =>
      this.getTopClients.execute(code, range)
    ),
    { initialValue: initialRequestState<ClientItem[]>() }
  );

  readonly isRefreshing = computed(
    () => this.advisor().loading || this.evolution().loading || this.topClients().loading
  );

  retry() {
    this.retry$.next();
  }
}
