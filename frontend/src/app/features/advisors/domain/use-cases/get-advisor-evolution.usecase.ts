import { inject, Injectable } from "@angular/core";
import { AdvisorsRepository } from "../../data/repositories/advisors.repository";

@Injectable({ providedIn: "root" })
export class GetAdvisorEvolutionUseCase {
  private readonly repository = inject(AdvisorsRepository);

  execute(code: string) {
    return this.repository.getEvolution(code);
  }
}
