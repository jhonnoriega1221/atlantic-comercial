import { map, Observable } from "rxjs";
import { AdvisorRankingItem, LocationRanking } from "../types/advisor.types";
import { inject, Injectable } from "@angular/core";
import { AdvisorsRepository } from "../../data/repositories/advisors.repository";

@Injectable({ providedIn: "root" })
export class GetAdvisorsRankingUseCase {
  private readonly repository = inject(AdvisorsRepository);

  execute(): Observable<LocationRanking[]> {
    return this.repository.getRanking().pipe(map(groupByLocation));
  }
}

function groupByLocation(items: AdvisorRankingItem[]): LocationRanking[] {
  const groups = new Map<string, AdvisorRankingItem[]>();
  for (const item of items) {
    groups.set(item.location, [...(groups.get(item.location) ?? []), item]);
  }
  return [...groups.entries()]
    .map(([location, advisors]) => ({
      location,
      totalSales: advisors.reduce((sum, a) => sum + a.netSale, 0),
      advisors: [...advisors].sort((a, b) => b.netSale - a.netSale)
    }))
    .sort((a, b) => b.totalSales - a.totalSales); // sedes con más venta primero
}
