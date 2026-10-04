/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, Injectable } from "@angular/core";
import { HttpAdapter } from "../../../../core/http/http.adapter";
import { Observable } from "rxjs";
import { KpisResult, LocationItem, TrendItem } from "../../domain/types/summary.types";

@Injectable({ providedIn: "root" })
export class SummaryRepository {
  private readonly http = inject(HttpAdapter);

  getKpis(filters: any): Observable<KpisResult> {
    return this.http.get<KpisResult>("/kpis", { params: filters });
  }

  getTrend(filters: any): Observable<TrendItem[]> {
    return this.http.get<TrendItem[]>("/kpis/trend", { params: filters });
  }

  getLocations(filters: any): Observable<LocationItem[]> {
    return this.http.get<LocationItem[]>("/kpis/sedes", { params: filters });
  }
}
