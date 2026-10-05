import { Component, computed, input, output } from "@angular/core";
import { DecimalPipe } from "@angular/common";
import { HlmButtonImports } from "@spartan-ng/helm/button";
import { HlmTableImports } from "@spartan-ng/helm/table";
import {
  FlexRender,
  injectTable,
  isFunction,
  type PaginationState,
  type SortingState
} from "@tanstack/angular-table";
import {
  ClientItem,
  ClientSort,
  ClientSortField,
  SortOrder
} from "../../../domain/types/client.types";
import { columns } from "./table/client-table.columns";
import { features } from "./table/client-table.feature";
import { NgIcon } from "@ng-icons/core";

@Component({
  selector: "app-clients-table",
  imports: [FlexRender, HlmTableImports, HlmButtonImports, DecimalPipe, NgIcon],
  templateUrl: "./clients-table.html"
})
export class ClientsTable {
  readonly data = input.required<ClientItem[]>();
  readonly rowCount = input.required<number>();
  readonly page = input.required<number>();
  readonly limit = input.required<number>();
  readonly sortBy = input<ClientSortField>();
  readonly sortOrder = input<SortOrder>("ASC");
  readonly isFetching = input(false);

  readonly pageChange = output<number>();
  readonly sortChange = output<ClientSort | null>();

  protected readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.rowCount() / this.limit()))
  );

  private readonly pagination = computed<PaginationState>(() => ({
    pageIndex: this.page() - 1,
    pageSize: this.limit()
  }));

  private readonly sorting = computed<SortingState>(() => {
    const id = this.sortBy();
    return id ? [{ id, desc: this.sortOrder() === "DESC" }] : [];
  });

  protected readonly table = injectTable(() => ({
    features,
    columns,
    data: this.data(),
    getRowId: (row: ClientItem) => row.clientId,
    manualPagination: true,
    manualSorting: true,
    rowCount: this.rowCount(),
    state: { pagination: this.pagination(), sorting: this.sorting() },
    onPaginationChange: (updater) => {
      const next = isFunction(updater) ? updater(this.pagination()) : updater;
      this.pageChange.emit(next.pageIndex + 1);
    },
    onSortingChange: (updater) => {
      const next = isFunction(updater) ? updater(this.sorting()) : updater;
      const first = next[0];
      this.sortChange.emit(
        first
          ? { sortBy: first.id as ClientSortField, sortOrder: first.desc ? "DESC" : "ASC" }
          : null
      );
    }
  }));
}
