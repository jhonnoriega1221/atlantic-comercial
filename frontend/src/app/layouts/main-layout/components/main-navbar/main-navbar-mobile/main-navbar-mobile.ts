import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

import { HlmButtonImports } from "@spartan-ng/helm/button";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideLayoutDashboard, lucideSettings, lucideListChecks } from "@ng-icons/lucide";
import { getMainNavigationItems } from "../../../../../core/navigation/domain/main-navigation.service";

@Component({
  selector: "app-main-navbar-mobile",
  imports: [HlmButtonImports, NgIcon, RouterLink, RouterLinkActive],
  templateUrl: "./main-navbar-mobile.html",
  styleUrl: "./main-navbar-mobile.css",
  viewProviders: [
    provideIcons({
      lucideLayoutDashboard,
      lucideSettings,
      lucideListChecks
    })
  ]
})
export class MainNavbarMobile {
  readonly items = getMainNavigationItems();
}
