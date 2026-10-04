import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IClientRepository } from "../../domain/repositories/client.repository.js";
import { I_CLIENTS_REPOSITORY } from "../../domain/repositories/client.repository.js";
import { ClientsQueryDto } from "../../domain/dto/client-query.dto.js";

@Injectable()
export class ClientService {
  constructor(
    @Inject(I_CLIENTS_REPOSITORY)
    private readonly clientRepository: IClientRepository
  ) {}

  async getClientHistory(clientId: string) {
    const history = await this.clientRepository.getClientHistory(clientId);
    if (!history || history.length === 0) {
      throw new NotFoundException([
        `El cliente con código ${clientId} no existe o no tiene historial de compras`
      ]);
    }
    return history;
  }

  async getPaginatedClients(query: ClientsQueryDto) {
    return await this.clientRepository.getPaginatedClients(query);
  }
}
