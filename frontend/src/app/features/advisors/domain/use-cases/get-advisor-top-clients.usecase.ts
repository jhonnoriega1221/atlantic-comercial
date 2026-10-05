import { inject, Injectable } from "@angular/core";
import { GetClientsUseCase } from "../../../clients/domain/use-cases/get-clients.usecase";
import { map } from "rxjs";

@Injectable({ providedIn: "root" })
export class GetAdvisorTopClientsUseCase {
  private readonly getClients = inject(GetClientsUseCase);

  execute(code: string, limit = 5) {
    return this.getClients
      .execute({ page: 1, limit, search: "", sortBy: "netSale", sortOrder: "DESC", advisor: code })
      .pipe(map((result) => result.data));
  }
}
