import {
  columnVisibilityFeature,
  rowPaginationFeature,
  tableFeatures
} from "@tanstack/angular-table";

export const features = tableFeatures({ columnVisibilityFeature, rowPaginationFeature });
export type PurchaseTableFeatures = typeof features;
