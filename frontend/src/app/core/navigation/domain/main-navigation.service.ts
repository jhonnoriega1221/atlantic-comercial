import { MainNavigationItem, mainNavigationItemsData } from "../data/main-navigation.data";

export function getMainNavigationItems(): MainNavigationItem[] {
  return mainNavigationItemsData.map((item: MainNavigationItem) => ({
    ...item
  }));
}
