import { Component, computed, signal } from "@angular/core";

@Component({
  selector: "app-home-greeting",
  imports: [],
  templateUrl: "./home-greeting.html",
  styleUrl: "./home-greeting.css"
})
export class HomeGreeting {
  showGreeting = signal<boolean>(false);

  protected readonly greeting = computed(() => {
    const hour = new Date().getHours();

    if (hour < 12) return "Buenos días";
    if (hour < 19) return "Buenas tardes";
    return "Buenas noches";
  });
}
