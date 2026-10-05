import { Injectable, computed, effect, inject, untracked } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  distinctUntilChanged,
  map,
  of,
  scan,
  startWith,
  switchMap
} from "rxjs";
import {
  CLIENT_SORT_FIELDS,
  ClientItem,
  ClientsFilters,
  ClientSort,
  ClientSortField,
  PaginatedResult
} from "../../domain/types/client.types";
import { GetClientsUseCase } from "../../domain/use-cases/get-clients.usecase";
import { GlobalFiltersStore } from "../../../../shared/global-filters/global-filters.store";

const DEFAULT_LIMIT = 10;
const LIMITS = [10, 20, 50];

const toPositiveInt = (value: string | null, fallback: number) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : fallback;
};

function parseFilters(params: ParamMap): ClientsFilters {
  const sortBy = params.get("sortBy") as ClientSortField | null;
  const limit = toPositiveInt(params.get("limit"), DEFAULT_LIMIT);
  return {
    page: toPositiveInt(params.get("page"), 1),
    limit: LIMITS.includes(limit) ? limit : DEFAULT_LIMIT,
    search: params.get("search")?.trim() ?? "",
    sortBy: sortBy && CLIENT_SORT_FIELDS.includes(sortBy) ? sortBy : undefined,
    sortOrder: params.get("sortOrder") === "DESC" ? "DESC" : "ASC"
  };
}

interface ClientsState {
  data: PaginatedResult<ClientItem> | null;
  loading: boolean;
  error: Error | null;
}

const INITIAL_STATE: ClientsState = { data: null, loading: true, error: null };

@Injectable()
export class ClientsFacade {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly getClients = inject(GetClientsUseCase);
  private readonly global = inject(GlobalFiltersStore);

  private readonly queryParams = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap
  });

  readonly filters = computed<ClientsFilters>(() => ({
    ...parseFilters(this.queryParams()),
    ...this.global.filters()
  }));

  private readonly retry$ = new BehaviorSubject<void>(undefined);

  private readonly state = toSignal(
    combineLatest([
      toObservable(this.filters).pipe(
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      ),
      this.retry$
    ]).pipe(
      switchMap(([filters]) =>
        this.getClients.execute(filters).pipe(
          map((data): Partial<ClientsState> => ({ data, loading: false, error: null })),
          catchError((error: Error) => of<Partial<ClientsState>>({ loading: false, error })),
          startWith<Partial<ClientsState>>({ loading: true, error: null })
        )
      ),
      scan<Partial<ClientsState>, ClientsState>(
        (state, patch) => ({ ...state, ...patch }),
        INITIAL_STATE
      )
    ),
    { initialValue: INITIAL_STATE }
  );

  readonly clients = computed(() => this.state().data?.data ?? []);
  readonly total = computed(() => this.state().data?.total ?? 0);
  readonly isLoading = computed(() => this.state().loading && !this.state().data); // solo la primera carga
  readonly isFetching = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);

  constructor() {
    let previous = JSON.stringify(this.global.filters());

    effect(() => {
      const { data, loading } = this.state();
      const key = JSON.stringify(this.global.filters());
      if (!data || loading) return; // mientras carga, `data` puede ser de la consulta anterior
      if (data.lastPage > 0 && this.filters().page > data.lastPage) {
        this.updateUrl({ page: data.lastPage }, true);
      }
      if (key === previous) return;
      previous = key;
      untracked(() => {
        if (this.filters().page !== 1) this.updateUrl({ page: null }, true);
      });
    });
  }

  setPage(page: number) {
    this.updateUrl({ page: page === 1 ? null : page });
  }

  setSearch(search: string) {
    this.updateUrl({ search: search.trim() || null, page: null }, true);
  }

  setSort(sort: ClientSort | null) {
    this.updateUrl({
      sortBy: sort?.sortBy ?? null,
      sortOrder: sort?.sortOrder ?? null,
      page: null
    });
  }

  retry() {
    this.retry$.next();
  }

  private updateUrl(patch: Record<string, string | number | null>, replace = false) {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: patch,
      queryParamsHandling: "merge",
      replaceUrl: replace
    });
  }
}
