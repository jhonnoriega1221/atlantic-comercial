import { Injectable } from "@angular/core";
import { ThemeMode } from "./theme.types";

@Injectable({ providedIn: "root" })
export class ThemeService {
  private readonly storageKey = "theme-preference";
  private readonly root = document.documentElement;
  private readonly systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  initialize(): void {
    this.applyTheme(this.getPreferredTheme());
  }

  getPreferredTheme(): ThemeMode {
    const saved = localStorage.getItem(this.storageKey) as ThemeMode;
    if (saved !== "dark" && saved !== "light" && saved !== "system") {
      this.setTheme("system");
      return "system";
    }
    return saved;
  }

  setTheme(theme: ThemeMode): void {
    if (theme === "light" || theme === "dark") {
      localStorage.setItem(this.storageKey, theme);
      this.applyTheme(theme);
      return;
    }

    localStorage.setItem(this.storageKey, "system");
    this.applyTheme(this.systemTheme);
  }

  private applyTheme(theme: ThemeMode) {
    this.root.classList.toggle(
      "dark",
      theme === "system" ? this.systemTheme === "dark" : theme === "dark"
    );
    this.root.classList.toggle(
      "light",
      theme === "system" ? this.systemTheme === "light" : theme === "light"
    );
  }
}
