import { DecimalPipe } from "@angular/common";
import { Component, computed, input, output } from "@angular/core";
import { HlmButtonImports } from "@spartan-ng/helm/button";
import { HlmTableImports } from "@spartan-ng/helm/table";
import { FlexRender, injectTable, isFunction, PaginationState } from "@tanstack/angular-table";
import { PurchaseItem } from "../../../domain/types/client-history.types";
import { features } from "./table/purcharse-history-table.features";
import { columns } from "./table/purchase-history-table.columns";
import { NgIcon } from "@ng-icons/core";

@Component({
  selector: "app-purchase-history-table",
  imports: [FlexRender, HlmTableImports, HlmButtonImports, DecimalPipe, NgIcon],
  templateUrl: "./purchase-history-table.html"
})
export class PurchaseHistoryTable {
  readonly data = input.required<PurchaseItem[]>();
  readonly rowCount = input.required<number>();
  readonly page = input.required<number>();
  readonly limit = input.required<number>();
  readonly isFetching = input(false);

  readonly pageChange = output<number>();

  protected readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.rowCount() / this.limit()))
  );

  private readonly pagination = computed<PaginationState>(() => ({
    pageIndex: this.page() - 1,
    pageSize: this.limit()
  }));

  protected readonly table = injectTable(() => ({
    features,
    columns,
    data: this.data(),
    manualPagination: true,
    rowCount: this.rowCount(),
    state: { pagination: this.pagination() },
    onPaginationChange: (updater) => {
      const next = isFunction(updater) ? updater(this.pagination()) : updater;
      this.pageChange.emit(next.pageIndex + 1);
    }
  }));
}
