import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { MainNavbarDesktop } from "./components/main-navbar/main-navbar-desktop/main-navbar-desktop";
import { MainNavbarMobile } from "./components/main-navbar/main-navbar-mobile/main-navbar-mobile";

@Component({
  selector: "app-main-layout",
  imports: [RouterOutlet, MainNavbarDesktop, MainNavbarMobile],
  templateUrl: "./main-layout.html",
  styleUrl: "./main-layout.css"
})
export class MainLayout {}
