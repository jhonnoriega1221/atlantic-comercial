import {
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures
} from "@tanstack/angular-table";

export const features = tableFeatures({
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSortingFeature
});
export type ClientsTableFeatures = typeof features;
