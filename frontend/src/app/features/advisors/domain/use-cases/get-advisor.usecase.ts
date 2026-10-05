import { inject, Injectable } from "@angular/core";
import { AdvisorsRepository } from "../../data/repositories/advisors.repository";
import { map } from "rxjs";
import { GlobalFilters } from "../../../../shared/global-filters/global-filters.types";

@Injectable({ providedIn: "root" })
export class GetAdvisorUseCase {
  private readonly repository = inject(AdvisorsRepository);

  execute(code: string, range: GlobalFilters) {
    return this.repository
      .getRanking(range)
      .pipe(map((list) => list.find((a) => a.advisorCode === code) ?? null));
  }
}
