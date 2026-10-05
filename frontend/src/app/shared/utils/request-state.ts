import { Observable, catchError, map, of, scan, startWith, switchMap } from "rxjs";

export interface RequestState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export const initialRequestState = <T>(): RequestState<T> => ({
  data: null,
  loading: true,
  error: null
});

export function toRequestState<T>(source$: Observable<T>): Observable<RequestState<T>> {
  return source$.pipe(
    map((data): RequestState<T> => ({ data, loading: false, error: null })),
    catchError((error: Error) => of<RequestState<T>>({ data: null, loading: false, error })),
    startWith<RequestState<T>>(initialRequestState<T>())
  );
}

export function switchToRequestState<TParams, T>(
  params$: Observable<TParams>,
  fetch: (params: TParams) => Observable<T>
): Observable<RequestState<T>> {
  return params$.pipe(
    switchMap((params) =>
      fetch(params).pipe(
        map((data): Partial<RequestState<T>> => ({ data, loading: false, error: null })),
        catchError((error: Error) =>
          of<Partial<RequestState<T>>>({ data: null, loading: false, error })
        ),
        startWith<Partial<RequestState<T>>>({ loading: true, error: null })
      )
    ),
    scan<Partial<RequestState<T>>, RequestState<T>>(
      (state, patch) => ({ ...state, ...patch }),
      initialRequestState<T>()
    )
  );
}
