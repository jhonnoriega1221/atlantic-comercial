import { inject, Injectable } from "@angular/core";
import { AdvisorRankingItem } from "../../domain/types/advisor.types";
import { HttpAdapter } from "../../../../core/http/http.adapter";
import { TrendItem } from "../../../summary/domain/types/summary.types";
import { GlobalFilters } from "../../../../shared/global-filters/global-filters.types";
import { toGlobalParams } from "../../../../shared/global-filters/global-filters.params";

@Injectable({ providedIn: "root" })
export class AdvisorsRepository {
  private readonly http = inject(HttpAdapter);

  getRanking(filters: GlobalFilters = {}) {
    return this.http.get<AdvisorRankingItem[]>("/advisors/ranking", {
      params: toGlobalParams(filters)
    });
  }

  getEvolution(code: string, range: GlobalFilters = {}) {
    return this.http.get<TrendItem[]>(`/advisors/${encodeURIComponent(code)}/evolution`, {
      params: toGlobalParams(range)
    });
  }
}
