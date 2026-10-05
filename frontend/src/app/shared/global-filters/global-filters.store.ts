import { Injectable, computed, signal } from "@angular/core";
import { GlobalFilters } from "./global-filters.types";

function clean(f: GlobalFilters): GlobalFilters {
  const out: GlobalFilters = {};
  if (f.startDate) out.startDate = f.startDate;
  if (f.endDate) out.endDate = f.endDate;
  if (f.location) out.location = f.location;
  if (f.advisor) out.advisor = f.advisor;
  return out;
}

const same = (a: GlobalFilters, b: GlobalFilters) =>
  (a.startDate ?? "") === (b.startDate ?? "") &&
  (a.endDate ?? "") === (b.endDate ?? "") &&
  (a.location ?? "") === (b.location ?? "") &&
  (a.advisor ?? "") === (b.advisor ?? "");

@Injectable({ providedIn: "root" })
export class GlobalFiltersStore {
  private readonly state = signal<GlobalFilters>({}, { equal: same });

  readonly filters = this.state.asReadonly();

  readonly activeCount = computed(() => {
    const f = this.state();
    return (f.startDate || f.endDate ? 1 : 0) + (f.location ? 1 : 0) + (f.advisor ? 1 : 0);
  });

  apply(next: GlobalFilters) {
    this.state.set(clean(next));
  }

  clear() {
    this.state.set({});
  }
}
