import { Instagram, BarChart3, CalendarDays, Radar, Newspaper, type LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  section?: string;
}

export const navigationItems: NavItem[] = [
  { title: "Instagram", href: "/instagram", icon: Instagram, section: "Contenu" },
  { title: "Analytics", href: "/analytics", icon: BarChart3, section: "Insights" },
  { title: "Calendar", href: "/calendar", icon: CalendarDays, section: "Insights" },
  { title: "Competitors", href: "/competitors", icon: Radar, section: "Insights" },
  { title: "News", href: "/news", icon: Newspaper, section: "Veille" },
];
