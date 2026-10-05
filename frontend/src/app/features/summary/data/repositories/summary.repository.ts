import { inject, Injectable } from "@angular/core";
import { HttpAdapter } from "../../../../core/http/http.adapter";
import { Observable } from "rxjs";
import { KpisResult, LocationItem, TrendItem } from "../../domain/types/summary.types";
import { toGlobalParams } from "../../../../shared/global-filters/global-filters.params";
import { GlobalFilters } from "../../../../shared/global-filters/global-filters.types";

@Injectable({ providedIn: "root" })
export class SummaryRepository {
  private readonly http = inject(HttpAdapter);

  getKpis(filters: GlobalFilters): Observable<KpisResult> {
    return this.http.get<KpisResult>("/kpis", { params: toGlobalParams(filters) });
  }

  getTrend(filters: GlobalFilters): Observable<TrendItem[]> {
    return this.http.get<TrendItem[]>("/kpis/trend", { params: toGlobalParams(filters) });
  }

  getLocations(filters: GlobalFilters): Observable<LocationItem[]> {
    return this.http.get<LocationItem[]>("/kpis/sedes", { params: toGlobalParams(filters) });
  }
}
