import { Routes } from "@angular/router";
import { MainLayout } from "../../layouts/main-layout/main-layout";

export const routes: Routes = [
  {
    path: "",
    component: MainLayout,
    children: [
      {
        path: "",
        pathMatch: "full",
        loadComponent: () =>
          import("./../../features/summary/presentation/pages/summary-page/summary-page").then(
            (m) => m.SummaryPage
          )
      },
      {
        path: "advisors",
        pathMatch: "full",
        loadComponent: () =>
          import("./../../features/advisors/presentation/pages/advisors-page/advisors-page").then(
            (m) => m.AdvisorsPage
          )
      },
      {
        path: "advisors/:id",
        pathMatch: "full",
        loadComponent: () =>
          import("./../../features/advisors/presentation/pages/advisor-details-page/advisor-details-page").then(
            (m) => m.AdvisorDetailsPage
          )
      },
      {
        path: "clients",
        pathMatch: "full",
        loadComponent: () =>
          import("./../../features/clients/presentation/pages/clients-page/clients-page").then(
            (m) => m.ClientsPage
          )
      },
      {
        path: "clients/:id",
        pathMatch: "full",
        loadComponent: () =>
          import("./../../features/clients/presentation/pages/client-details-page/client-details-page").then(
            (m) => m.ClientDetailsPage
          )
      },
      {
        path: "health",
        loadComponent: () => import("./../../features/health/health.page").then((m) => m.HealthPage)
      }
    ]
  }
];
