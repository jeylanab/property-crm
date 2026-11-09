import {
  LayoutDashboard, Building2, Users, FileText,
  Wallet, Wrench, UserCircle, type LucideIcon,
} from "lucide-react";

// ADD A NEW MODULE = add one line here + one folder in src/features + one page in src/app/(dashboard).
export type NavItem = { label: string; href: string; icon: LucideIcon };

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard",   href: "/dashboard",   icon: LayoutDashboard },
  { label: "Properties",  href: "/properties",  icon: Building2 },
  { label: "Tenants",     href: "/tenants",     icon: Users },
  { label: "Leases",      href: "/leases",      icon: FileText },
  { label: "Payments",    href: "/payments",    icon: Wallet },
  { label: "Maintenance", href: "/maintenance", icon: Wrench },
  { label: "Owners",      href: "/owners",      icon: UserCircle },
];

export const EMIRATES = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"] as const;

export const DUBAI_AREAS = ["Dubai Marina", "JVC", "Downtown Dubai", "Business Bay", "JLT", "Palm Jumeirah", "Dubai Hills"] as const;

export const PROPERTY_TYPES = ["apartment", "villa", "townhouse", "office", "retail"] as const;
export const PROPERTY_TYPE_LABELS: Record<(typeof PROPERTY_TYPES)[number], string> = {
  apartment: "Apartment", villa: "Villa", townhouse: "Townhouse", office: "Office", retail: "Retail",
};

export const UNIT_STATUS = ["vacant", "rented", "maintenance"] as const;
export const PAYMENT_STATUS = ["pending", "paid", "overdue", "bounced"] as const;
export const REQUEST_STATUS = ["open", "in_progress", "done"] as const;
