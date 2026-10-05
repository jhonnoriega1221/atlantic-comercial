import { Component, computed, inject, viewChild } from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideSlidersHorizontal } from "@ng-icons/lucide";
import { HlmButtonImports } from "@spartan-ng/helm/button";
import { HlmInputImports } from "@spartan-ng/helm/input";
import { catchError, of } from "rxjs";
import { ResponsivePopup } from "../../shared/components/responsive-popup/responsive-popup";
import { FilterOptions } from "../../features/advisors/domain/types/filter-options.types";
import { GetFilterOptionsUseCase } from "../../features/advisors/domain/use-cases/get-filter-options.usecase";
import { GlobalFiltersStore } from "../../shared/global-filters/global-filters.store";
import { displayLocation } from "../../shared/utils/format";

const EMPTY_OPTIONS: FilterOptions = { locations: [], advisors: [] };
const toMonthStart = (date: string) => (date ? `${date.slice(0, 7)}-01` : undefined);

@Component({
  selector: "app-global-filters-fab",
  imports: [ReactiveFormsModule, ResponsivePopup, HlmButtonImports, HlmInputImports, NgIcon],
  providers: [provideIcons({ lucideSlidersHorizontal })],
  templateUrl: "./global-filter-fab.html"
})
export class GlobalFiltersFab {
  protected readonly store = inject(GlobalFiltersStore);
  private readonly popup = viewChild.required(ResponsivePopup);
  protected readonly displayLocation = displayLocation;

  protected readonly options = toSignal(
    inject(GetFilterOptionsUseCase)
      .execute()
      .pipe(catchError(() => of(EMPTY_OPTIONS))),
    { initialValue: EMPTY_OPTIONS }
  );

  protected readonly form = new FormGroup({
    startDate: new FormControl("", { nonNullable: true }),
    endDate: new FormControl("", { nonNullable: true }),
    location: new FormControl("", { nonNullable: true }),
    advisor: new FormControl("", { nonNullable: true })
  });

  private readonly value = toSignal(this.form.valueChanges, {
    initialValue: this.form.getRawValue()
  });

  protected readonly advisorOptions = computed(() => {
    const location = this.value().location ?? "";
    return this.options().advisors.filter((a) => !location || a.location === location);
  });

  protected readonly rangeInvalid = computed(() => {
    const { startDate, endDate } = this.value();
    return !!startDate && !!endDate && startDate.slice(0, 7) > endDate.slice(0, 7);
  });

  protected readonly canClear = computed(
    () => this.store.activeCount() > 0 || Object.values(this.value()).some(Boolean)
  );

  constructor() {
    this.form.controls.location.valueChanges.pipe(takeUntilDestroyed()).subscribe((location) => {
      const advisor = this.form.controls.advisor.value;
      const valid =
        !advisor ||
        this.options().advisors.some(
          (a) => a.code === advisor && (!location || a.location === location)
        );
      if (!valid) this.form.controls.advisor.setValue("");
    });
  }

  protected open() {
    const f = this.store.filters();
    this.form.reset({
      startDate: f.startDate ?? "",
      endDate: f.endDate ?? "",
      location: f.location ?? "",
      advisor: f.advisor ?? ""
    });
    this.popup().open();
  }

  protected apply() {
    if (this.rangeInvalid()) return;
    const v = this.form.getRawValue();
    this.store.apply({
      startDate: toMonthStart(v.startDate),
      endDate: toMonthStart(v.endDate),
      location: v.location,
      advisor: v.advisor
    });
    this.popup().close();
  }

  protected clear() {
    this.form.reset();
    this.store.clear();
    this.popup().close();
  }
}
