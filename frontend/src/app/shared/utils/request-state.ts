import { Observable, catchError, map, of, startWith } from "rxjs";

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
