import { Inject, Injectable } from "@nestjs/common";
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
    return await this.clientRepository.getClientHistory(clientId);
  }

  async getPaginatedClients(query: ClientsQueryDto) {
    return await this.clientRepository.getPaginatedClients(query);
  }
}
