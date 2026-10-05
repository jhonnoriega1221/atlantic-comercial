import { inject, Injectable } from "@angular/core";
import { AdvisorsRepository } from "../../data/repositories/advisors.repository";
import { GlobalFilters } from "../../../../shared/global-filters/global-filters.types";

@Injectable({ providedIn: "root" })
export class GetAdvisorEvolutionUseCase {
  private readonly repository = inject(AdvisorsRepository);

  execute(code: string, range: GlobalFilters) {
    return this.repository.getEvolution(code, range);
  }
}
