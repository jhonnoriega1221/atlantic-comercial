import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AdvisorRankingItem } from "../../domain/types/advisor.types";
import { HttpAdapter } from "../../../../core/http/http.adapter";

@Injectable({ providedIn: "root" })
export class AdvisorsRepository {
  private readonly http = inject(HttpAdapter);

  getRanking(): Observable<AdvisorRankingItem[]> {
    return this.http.get<AdvisorRankingItem[]>("/advisors/ranking");
  }
}
