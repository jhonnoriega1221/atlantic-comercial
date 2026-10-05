import { Observable } from "rxjs";
import { ClientItem, ClientsFilters, PaginatedResult } from "../domain/types/client.types";
import { HttpAdapter } from "../../../core/http/http.adapter";
import { inject, Injectable } from "@angular/core";
import { ClientHistory, HistoryFilters } from "../domain/types/client-history.types";

@Injectable({ providedIn: "root" })
export class ClientsRepository {
  private readonly http = inject(HttpAdapter);

  getAll(f: ClientsFilters): Observable<PaginatedResult<ClientItem>> {
    const params: Record<string, string | number> = { page: f.page, limit: f.limit };
    if (f.search) params["search"] = f.search;
    if (f.sortBy) {
      params["sortBy"] = f.sortBy;
      params["sortOrder"] = f.sortOrder;
    }
    if (f.advisor) params["advisor"] = f.advisor;
    return this.http.get<PaginatedResult<ClientItem>>("/clients", { params });
  }

  getHistory(clientId: string, f: HistoryFilters): Observable<ClientHistory> {
    return this.http.get<ClientHistory>(`/clients/${encodeURIComponent(clientId)}/history`, {
      params: { page: f.page, limit: f.limit }
    });
  }
}
