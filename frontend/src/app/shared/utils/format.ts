export const cop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
});
export const int = new Intl.NumberFormat("es-CO");
const pct = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 1, signDisplay: "exceptZero" });

export const formatMillions = (v: number) => `$${int.format(Math.round(v / 1_000_000))} M`;
export const formatPercent = (v: number) => `${pct.format(v)}%`; // 22.9 se convierte a +22,9%

const LOCATION_NAMES: Record<string, string> = { BOGOTA: "Bogotá", MEDELLIN: "Medellín" };

export const displayLocation = (name: string | null | undefined) => {
  if (!name) return "Sin sede";
  return LOCATION_NAMES[name] ?? name.charAt(0) + name.slice(1).toLowerCase();
};
