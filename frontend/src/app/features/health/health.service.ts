import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "../../../environments/environment";

export interface Health {
  status: string;
  timestamp: string;
}

@Injectable({ providedIn: "root" })
export class HealthService {
  private http = inject(HttpClient);

  getHealth() {
    return this.http.get<Health>(`${environment.apiUrl}/health`);
  }
}
