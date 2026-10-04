import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";
import { environment } from "../../../environments/environment";

export interface HttpOptions {
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
}

@Injectable({ providedIn: "root" })
export class HttpAdapter {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  get<T>(url: string, options?: HttpOptions): Observable<T> {
    const params = this.buildParams(options?.params);
    return this.http
      .get<T>(`${this.baseUrl}${url}`, { params, headers: options?.headers })
      .pipe(catchError(this.handleError));
  }

  private buildParams(params?: Record<string, string | number | boolean>): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }
    return httpParams;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage = error.error?.error || error.message || "Error desconocido";
    console.error("HTTP Error:", errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
