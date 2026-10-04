import { Injectable } from "@angular/core";
import packageJson from "../../../../package.json";

@Injectable({ providedIn: "root" })
export class AppInfoService {
  readonly version = packageJson.version;
  readonly name = packageJson.name;

  hasSeenDashboardGreeting = false;
}
