import { Routes } from "@angular/router";

export const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "health" },
  {
    path: "health",
    loadComponent: () => import("./features/health/health.page").then((m) => m.HealthPage)
  }
];
