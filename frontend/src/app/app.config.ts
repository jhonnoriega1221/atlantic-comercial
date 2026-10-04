import { ApplicationConfig, provideBrowserGlobalErrorListeners } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";

import { routes } from "./core/routes/app.routes";
import { provideIcons } from "@ng-icons/core";
import { APP_ICONS } from "./shared/components/icons/app-icons";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideIcons(APP_ICONS),
    provideHttpClient()
  ]
};
