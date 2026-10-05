import { Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Row } from "@tanstack/angular-table";
import { ClientItem } from "../../../../domain/types/client.types";
import { ClientsTableFeatures } from "./client-table.feature";

@Component({
  selector: "app-client-name-cell",
  imports: [RouterLink],
  host: { class: "block min-w-40" },
  template: `
    <a
      [routerLink]="['/clients', row().original.clientId]"
      class="block font-medium hover:underline"
    >
      {{ row().original.clientName }}
    </a>
    <span class="text-muted-foreground text-xs">{{ row().original.clientId }}</span>
  `
})
export class ClientNameCell {
  readonly row = input.required<Row<ClientsTableFeatures, ClientItem>>();
}
