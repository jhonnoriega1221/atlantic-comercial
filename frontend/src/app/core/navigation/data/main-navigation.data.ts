export interface MainNavigationItem {
  icon: string;
  title: string;
  url: string;
}

export const mainNavigationItemsData: MainNavigationItem[] = [
  { icon: "lucideLayoutDashboard", title: "Dashboard", url: "/" },
  { icon: "lucideUser2", title: "Asesores", url: "/advisors" },
  { icon: "lucideStore", title: "Clientes", url: "/clients" }
];
