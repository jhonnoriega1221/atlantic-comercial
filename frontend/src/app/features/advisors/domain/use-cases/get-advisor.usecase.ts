import { inject, Injectable } from "@angular/core";
import { AdvisorsRepository } from "../../data/repositories/advisors.repository";
import { map, Observable } from "rxjs";
import { AdvisorRankingItem } from "../types/advisor.types";

@Injectable({ providedIn: "root" })
export class GetAdvisorUseCase {
  private readonly repository = inject(AdvisorsRepository);

  execute(code: string): Observable<AdvisorRankingItem | null> {
    return this.repository
      .getRanking()
      .pipe(map((list) => list.find((a) => a.advisorCode === code) ?? null));
  }
}
