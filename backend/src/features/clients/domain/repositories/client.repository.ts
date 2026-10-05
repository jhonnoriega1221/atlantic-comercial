import { ClientHistoryQueryDto } from "../dto/client-history-query.dto.js";
import { ClientsQueryDto } from "../dto/client-query.dto.js";
import { ClientHistoryItem, ClientListItem } from "../types/client.types.js";

export abstract class ClientRepository {
  abstract getPaginatedClients(query: ClientsQueryDto): Promise<{
    data: ClientListItem[];
    total: number;
    page: number;
    lastPage: number;
  }>;

  abstract getClientHistory(
    clientId: string,
    query: ClientHistoryQueryDto
  ): Promise<{
    clientId: string;
    clientName: string;
    history: ClientHistoryItem[];
    total: number;
    page: number;
    lastPage: number;
  } | null>;
}
