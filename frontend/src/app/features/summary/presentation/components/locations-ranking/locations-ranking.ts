import { Component, input, computed } from "@angular/core";
import { HLM_CHART_THEME, HlmChartImports, hlmChartTooltip } from "@spartan-ng/helm/chart";
import { barX, defineChart } from "@tanstack/charts";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { LocationItem } from "../../../domain/types/summary.types";

const cop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
});
const int = new Intl.NumberFormat("es-CO");
const pct = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 1 });

const formatMillions = (v: number) => `$${int.format(Math.round(v / 1_000_000))} M`;

// Mostrar nombre de manera correcta
const DISPLAY_NAMES: Record<string, string> = {
  BOGOTA: "Bogotá",
  MEDELLIN: "Medellín"
};
const displayName = (name: string) =>
  DISPLAY_NAMES[name] ?? name.charAt(0) + name.slice(1).toLowerCase();

@Component({
  selector: "app-locations-ranking",
  imports: [HlmChartImports],
  templateUrl: "./locations-ranking.html"
})
export class LocationsRanking {
  data = input.required<LocationItem[]>();

  protected readonly chartOptions = computed(() => {
    const dataset = this.data();
    if (dataset.length === 0) return null;

    return {
      definition: defineChart(
        {
          marks: [
            barX(dataset, {
              x: "netSale",
              y: "location",
              fill: "var(--chart-1)"
            })
          ],
          scales: {
            x: {
              scale: scaleLinear,
              nice: true,
              grid: true,
              axis: { ticks: { format: (v: number) => formatMillions(v) } }
            },
            y: {
              scale: () => scaleBand<string>().padding(0.25),
              axis: { ticks: { format: (v: string) => displayName(v) } }
            }
          },
          theme: HLM_CHART_THEME
        },
        {
          focus: "nearest",
          tooltip: hlmChartTooltip({
            items: [
              { channel: "y", label: "Sede", text: (p) => displayName(String(p.yValue)) },
              { channel: "x", label: "Venta neta", text: (p) => cop.format(Number(p.xValue)) },
              {
                field: "participation",
                label: "Participación",
                text: (p) => `${pct.format(p.datum.participation)}%`
              }
            ]
          })
        }
      ),
      ariaLabel: "Ventas netas por sede",
      ariaDescription: "Gráfico de barras horizontales que compara la venta neta de cada sede.",
      aspectRatio: 4 / 3
    };
  });
}
