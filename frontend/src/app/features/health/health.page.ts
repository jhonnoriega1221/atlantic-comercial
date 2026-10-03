import { Component, OnInit, inject, signal } from "@angular/core";
import { Health, HealthService } from "./health.service";

@Component({
  selector: "app-health-page",
  templateUrl: "./health.page.html"
})
export class HealthPage implements OnInit {
  private healthService = inject(HealthService);

  health = signal<Health | null>(null);
  error = signal(false);

  ngOnInit() {
    this.healthService.getHealth().subscribe({
      next: (h) => this.health.set(h),
      error: () => this.error.set(true)
    });
  }
}
