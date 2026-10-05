import { Component, computed, inject, model, output, signal } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { BreakpointObserver } from "@angular/cdk/layout";
import { HlmDialogImports } from "@spartan-ng/helm/dialog";
import { HlmDrawerImports } from "@spartan-ng/helm/drawer";

type ResponsivePopupState = "open" | "closed";

@Component({
  selector: "app-responsive-popup",
  imports: [NgTemplateOutlet, HlmDrawerImports, HlmDialogImports],
  templateUrl: "./responsive-popup.html",
  styleUrl: "./responsive-popup.css"
})
export class ResponsivePopup {
  state = model<ResponsivePopupState>("closed");

  opened = output<void>();
  closedEvent = output<void>();

  protected readonly isOpen = computed(() => this.state() === "open");

  private readonly _breakpointObserver = inject(BreakpointObserver);
  protected readonly isMobile = signal(false);

  constructor() {
    this._breakpointObserver
      .observe("(max-width: 640px)")
      .pipe(takeUntilDestroyed())
      .subscribe((result) => this.isMobile.set(result.matches));
  }

  open(): void {
    if (this.state() === "open") return;
    this.state.set("open");
    this.opened.emit();
  }

  close(): void {
    if (this.state() === "closed") return;
    this.state.set("closed");
    this.closedEvent.emit();
  }

  toggle(): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.isOpen() ? this.close() : this.open();
  }

  protected handleClosed(): void {
    this.state.set("closed");
    this.closedEvent.emit();
  }
}
