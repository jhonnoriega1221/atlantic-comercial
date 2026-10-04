import { inject, Injectable } from "@angular/core";
import { HistoryFilters } from "../types/client-history.types";
import { ClientsRepository } from "../../data/client.repository";

@Injectable({ providedIn: "root" })
export class GetClientHistoryUseCase {
  private readonly repository = inject(ClientsRepository);

  execute(clientId: string, filters: HistoryFilters) {
    return this.repository.getHistory(clientId, filters);
  }
}
