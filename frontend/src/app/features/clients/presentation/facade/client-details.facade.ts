import { Injectable, computed, inject, signal } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
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
import { ClientHistory } from "../../domain/types/client-history.types";
import { GetClientHistoryUseCase } from "../../domain/use-cases/get-client-history.usecase";

const HISTORY_LIMIT = 10;

interface HistoryState {
  data: ClientHistory | null;
  loading: boolean;
  error: Error | null;
}

const INITIAL_STATE: HistoryState = { data: null, loading: true, error: null };

@Injectable()
export class ClientDetailsFacade {
  private readonly route = inject(ActivatedRoute);
  private readonly getHistory = inject(GetClientHistoryUseCase);

  readonly limit = HISTORY_LIMIT;
  readonly page = signal(1);

  private readonly clientId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get("id") ?? "")),
    { initialValue: this.route.snapshot.paramMap.get("id") ?? "" }
  );

  private readonly retry$ = new BehaviorSubject<void>(undefined);

  private readonly request = computed(() => ({ id: this.clientId(), page: this.page() }));

  private readonly state = toSignal(
    combineLatest([toObservable(this.request), this.retry$]).pipe(
      switchMap(([{ id, page }]) =>
        this.getHistory.execute(id, { page, limit: HISTORY_LIMIT }).pipe(
          map((data): Partial<HistoryState> => ({ data, loading: false, error: null })),
          catchError((error: Error) => of<Partial<HistoryState>>({ loading: false, error })),
          startWith<Partial<HistoryState>>({ loading: true, error: null })
        )
      ),
      scan<Partial<HistoryState>, HistoryState>(
        (state, patch) => ({ ...state, ...patch }),
        INITIAL_STATE
      )
    ),
    { initialValue: INITIAL_STATE }
  );

  readonly clientId$ = this.clientId;
  readonly clientName = computed(() => this.state().data?.clientName ?? "");
  readonly items = computed(() => this.state().data?.history ?? []);
  readonly total = computed(() => this.state().data?.total ?? 0);
  readonly isLoading = computed(() => this.state().loading && !this.state().data);
  readonly isFetching = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);

  setPage(page: number) {
    this.page.set(page);
  }

  retry() {
    this.retry$.next();
  }
}
