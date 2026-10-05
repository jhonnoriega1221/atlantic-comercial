import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

import { HlmButtonImports } from "@spartan-ng/helm/button";
import { NgIcon } from "@ng-icons/core";
import { getMainNavigationItems } from "../../../../../core/navigation/domain/main-navigation.service";

@Component({
  selector: "app-main-navbar-desktop",
  imports: [HlmButtonImports, NgIcon, RouterLink, RouterLinkActive],
  templateUrl: "./main-navbar-desktop.html",
  styleUrl: "./main-navbar-desktop.css"
})
export class MainNavbarDesktop {
  readonly items = getMainNavigationItems();

  readonly topItems = this.items.filter((item) => item.url !== "/settings");
  readonly bottomItems = this.items.filter((item) => item.url === "/settings");
}
