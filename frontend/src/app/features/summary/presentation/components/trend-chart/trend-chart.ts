import { Component, input, computed } from "@angular/core";
import { HLM_CHART_THEME, HlmChartImports, hlmChartTooltip } from "@spartan-ng/helm/chart";
import { defineChart, lineY } from "@tanstack/charts";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { scalePoint } from "@tanstack/charts/scales/point";
import { TrendItem } from "../../../domain/types/summary.types";

const shortMonth = new Intl.DateTimeFormat("es-CO", { month: "short" });
const longMonth = new Intl.DateTimeFormat("es-CO", { month: "long", year: "numeric" });
const cop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
});
const int = new Intl.NumberFormat("es-CO");

const toDate = (period: string) => new Date(`${period}T00:00:00`);
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// pasa a M ej. (3182581563 -> "$3.183 M)"
const formatMillions = (v: number) => `$${int.format(Math.round(v / 1_000_000))} M`;

@Component({
  selector: "app-trend-chart",
  imports: [HlmChartImports],
  styleUrl: "./trend-chart.css",
  templateUrl: "./trend-chart.html"
})
export class TrendChart {
  data = input.required<TrendItem[]>();

  protected readonly chartOptions = computed(() => {
    const dataset = this.data();
    if (dataset.length === 0) return null;

    return {
      definition: defineChart(
        {
          marks: [
            lineY(dataset, {
              x: "period",
              y: "netSale",
              points: true,
              stroke: "var(--chart-1)",
              strokeWidth: 2.5
            })
          ],
          scales: {
            x: {
              scale: () => scalePoint<string>().padding(0.2),
              axis: {
                ticks: {
                  format: (v: string) => capitalize(shortMonth.format(toDate(v)).replace(".", ""))
                }
              }
            },
            y: {
              scale: scaleLinear,
              nice: true,
              grid: true,
              axis: { ticks: { format: (v: number) => formatMillions(v) } }
            }
          },
          theme: HLM_CHART_THEME
        },
        {
          focus: "nearest-x",
          tooltip: hlmChartTooltip({
            items: [
              {
                channel: "x",
                label: "Mes",
                text: (p) => capitalize(longMonth.format(toDate(String(p.xValue))))
              },
              {
                channel: "y",
                label: "Venta neta",
                text: (p) => cop.format(Number(p.yValue))
              },
              {
                field: "transactions",
                label: "Transacciones",
                text: (p) => int.format(p.datum.transactions)
              }
            ]
          })
        }
      ),
      ariaLabel: "Tendencia mensual de ventas",
      ariaDescription: "Gráfico de líneas que muestra la venta neta por mes.",
      aspectRatio: 16 / 9
    };
  });
}
