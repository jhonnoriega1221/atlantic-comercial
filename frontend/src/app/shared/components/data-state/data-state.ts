import { Component, computed, input, output } from "@angular/core";
import { HlmButtonImports } from "@spartan-ng/helm/button";
import { NgIcon } from "@ng-icons/core";

export type DataStateType = "empty" | "error";

@Component({
  imports: [HlmButtonImports, NgIcon],
  selector: "app-data-state",
  styleUrl: "./data-state.css",
  templateUrl: "./data-state.html"
})
export class DataState {
  type = input<DataStateType>("empty");
  title = input<string>();
  description = input<string>();
  imageUrl = input<string>();
  buttonText = input<string>();

  titleMessage = computed(() => {
    if (!this.title()) {
      if (this.type() === "error") {
        return "Hubo un error al intentar obtener los datos";
      } else {
        return "No se encontraron datos";
      }
    } else {
      return this.title();
    }
  });

  descriptionMessage = computed(() => {
    if (!this.description()) {
      if (this.type() === "error") {
        return "Por favor, inténtalo más tarde";
      } else {
        return "";
      }
    } else {
      return this.description();
    }
  });

  buttonLabel = computed(() => {
    if (!this.buttonText()) {
      if (this.type() === "error") {
        return "Volver a cargar";
      } else {
        return "";
      }
    } else {
      return this.buttonText();
    }
  });

  action = output<void>();
}
