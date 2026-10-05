import { inject, Injectable } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, combineLatest, map, switchMap } from "rxjs";
import { GetAdvisorUseCase } from "../../domain/use-cases/get-advisor.usecase";
import { GetAdvisorEvolutionUseCase } from "../../domain/use-cases/get-advisor-evolution.usecase";
import { GetAdvisorTopClientsUseCase } from "../../domain/use-cases/get-advisor-top-clients.usecase";
import { initialRequestState, toRequestState } from "../../../../shared/utils/request-state";
import { AdvisorRankingItem } from "../../domain/types/advisor.types";
import { TrendItem } from "../../../summary/domain/types/summary.types";
import { ClientItem } from "../../../clients/domain/types/client.types";

@Injectable()
export class AdvisorDetailsFacade {
  private readonly route = inject(ActivatedRoute);
  private readonly getAdvisor = inject(GetAdvisorUseCase);
  private readonly getEvolution = inject(GetAdvisorEvolutionUseCase);
  private readonly getTopClients = inject(GetAdvisorTopClientsUseCase);

  readonly code = toSignal(this.route.paramMap.pipe(map((p) => p.get("id") ?? "")), {
    initialValue: this.route.snapshot.paramMap.get("id") ?? ""
  });

  private readonly retry$ = new BehaviorSubject<void>(undefined);

  private readonly request$ = combineLatest([toObservable(this.code), this.retry$]).pipe(
    map(([code]) => code)
  );

  readonly advisor = toSignal(
    this.request$.pipe(switchMap((code) => toRequestState(this.getAdvisor.execute(code)))),
    { initialValue: initialRequestState<AdvisorRankingItem | null>() }
  );

  readonly evolution = toSignal(
    this.request$.pipe(switchMap((code) => toRequestState(this.getEvolution.execute(code)))),
    { initialValue: initialRequestState<TrendItem[]>() }
  );

  readonly topClients = toSignal(
    this.request$.pipe(switchMap((code) => toRequestState(this.getTopClients.execute(code)))),
    { initialValue: initialRequestState<ClientItem[]>() }
  );

  retry() {
    this.retry$.next();
  }
}
