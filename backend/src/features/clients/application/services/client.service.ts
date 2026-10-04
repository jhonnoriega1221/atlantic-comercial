import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ClientRepository } from "../../domain/repositories/client.repository.js";
import { ClientsQueryDto } from "../../domain/dto/client-query.dto.js";
import { ClientHistoryQueryDto } from "../../domain/dto/client-history-query.dto.js";

@Injectable()
export class ClientService {
  constructor(
    @Inject(ClientRepository)
    private readonly clientRepository: ClientRepository
  ) {}

  async getClientHistory(clientId: string, query: ClientHistoryQueryDto) {
    const data = await this.clientRepository.getClientHistory(clientId, query);
    if (!data?.total || data.total === 0) {
      throw new NotFoundException([
        `El cliente con código ${clientId} no existe o no tiene historial de compras`
      ]);
    }
    return data;
  }

  async getPaginatedClients(query: ClientsQueryDto) {
    return await this.clientRepository.getPaginatedClients(query);
  }
}
