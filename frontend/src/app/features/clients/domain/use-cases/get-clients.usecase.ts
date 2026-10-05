import { inject, Injectable } from "@angular/core";
import { ClientsFilters } from "../types/client.types";
import { ClientsRepository } from "../../data/client.repository";

@Injectable({ providedIn: "root" })
export class GetClientsUseCase {
  private readonly repository = inject(ClientsRepository);

  execute(filters: ClientsFilters) {
    return this.repository.getAll(filters);
  }
}
