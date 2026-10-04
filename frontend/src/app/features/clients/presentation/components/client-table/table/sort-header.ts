import { Component, input } from "@angular/core";
import { NgIcon } from "@ng-icons/core";
import { HlmButtonImports } from "@spartan-ng/helm/button";

interface SortableColumn {
  getIsSorted(): false | "asc" | "desc";
  toggleSorting(desc?: boolean): void;
}

@Component({
  selector: "app-sort-header",
  imports: [HlmButtonImports, NgIcon],
  providers: [],
  host: { class: "flex", "[class.justify-end]": "align() === 'end'" },
  template: `
    <button
      hlmBtn
      variant="ghost"
      size="sm"
      class="h-8"
      (click)="column().toggleSorting(column().getIsSorted() === 'asc')"
    >
      <span>{{ title() }}</span>
      @switch (column().getIsSorted()) {
        @case ("asc") {
          <ng-icon name="lucideArrowUp" />
        }
        @case ("desc") {
          <ng-icon name="lucideArrowDown" />
        }
        @default {
          <ng-icon name="lucideChevronsUpDown" />
        }
      }
    </button>
  `
})
export class SortHeader {
  readonly column = input.required<SortableColumn>();
  readonly title = input.required<string>();
  readonly align = input<"start" | "end">("start");
}
