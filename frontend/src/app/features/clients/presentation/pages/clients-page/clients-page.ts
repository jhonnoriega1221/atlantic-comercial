import { Component, inject } from "@angular/core";
import { ClientsFacade } from "../../facade/clients.facade";
import { ClientsTable } from "../../components/client-table/clients-table";
import { DataState } from "../../../../../shared/components/data-state/data-state";
import { HlmInputImports } from "@spartan-ng/helm/input";
import { debounceTime, distinctUntilChanged, Subject } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-clients-page",
  imports: [ClientsTable, DataState, HlmInputImports],
  providers: [ClientsFacade],
  templateUrl: "./clients-page.html"
})
export class ClientsPage {
  protected readonly facade = inject(ClientsFacade);
  protected readonly search$ = new Subject<string>();

  constructor() {
    this.search$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((value) => this.facade.setSearch(value));
  }
}
