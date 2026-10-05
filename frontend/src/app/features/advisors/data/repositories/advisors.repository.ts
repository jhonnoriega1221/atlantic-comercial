import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AdvisorRankingItem } from "../../domain/types/advisor.types";
import { HttpAdapter } from "../../../../core/http/http.adapter";
import { TrendItem } from "../../../summary/domain/types/summary.types";

@Injectable({ providedIn: "root" })
export class AdvisorsRepository {
  private readonly http = inject(HttpAdapter);

  getRanking(): Observable<AdvisorRankingItem[]> {
    return this.http.get<AdvisorRankingItem[]>("/advisors/ranking");
  }

  getEvolution(code: string): Observable<TrendItem[]> {
    return this.http.get<TrendItem[]>(`/advisors/${encodeURIComponent(code)}/evolution`);
  }
}
