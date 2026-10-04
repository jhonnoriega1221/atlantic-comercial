import { ClientsQueryDto } from "../dto/client-query.dto.js";

export const I_CLIENTS_REPOSITORY = "IClientsRepository";

export interface IClientRepository {
  getPaginatedClients(query: ClientsQueryDto): Promise<{
    data: any[];
    total: number;
    page: number;
    lastPage: number;
  }>;

  getClientHistory(clientId: string): Promise<any[]>;
}
