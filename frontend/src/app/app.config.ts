import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners
} from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";

import { routes } from "./core/routes/app.routes";
import { provideIcons } from "@ng-icons/core";
import { APP_ICONS } from "./shared/components/icons/app-icons";
import { ThemeService } from "./core/theme/theme.service";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideIcons(APP_ICONS),
    provideHttpClient(),
    provideAppInitializer(() => {
      const themeService = inject(ThemeService);
      themeService.initialize();
    })
  ]
};
