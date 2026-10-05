import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { FilterOptions } from "../types/filter-options.types";
import { AdvisorsRepository } from "../../data/repositories/advisors.repository";

@Injectable({ providedIn: "root" })
export class GetFilterOptionsUseCase {
  private readonly repository = inject(AdvisorsRepository);

  execute(): Observable<FilterOptions> {
    return this.repository.getRanking().pipe(
      map((items) => ({
        locations: [...new Set(items.map((i) => i.location))].sort(),
        advisors: items
          .map((i) => ({ code: i.advisorCode, name: i.advisorName, location: i.location }))
          .sort((a, b) => a.name.localeCompare(b.name))
      }))
    );
  }
}
