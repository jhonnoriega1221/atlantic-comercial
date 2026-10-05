import { inject, Injectable } from "@angular/core";
import { GetClientsUseCase } from "../../../clients/domain/use-cases/get-clients.usecase";
import { map } from "rxjs";
import { GlobalFilters } from "../../../../shared/global-filters/global-filters.types";

@Injectable({ providedIn: "root" })
export class GetAdvisorTopClientsUseCase {
  private readonly getClients = inject(GetClientsUseCase);

  execute(code: string, range: GlobalFilters, limit = 5) {
    return this.getClients
      .execute({
        page: 1,
        limit,
        search: "",
        sortBy: "netSale",
        sortOrder: "DESC",
        advisor: code,
        ...range
      })
      .pipe(map((result) => result.data));
  }
}
