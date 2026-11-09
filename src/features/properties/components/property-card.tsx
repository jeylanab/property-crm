import Link from "next/link";
import { Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PROPERTY_TYPE_LABELS } from "@/lib/constants";
import { formatAED } from "@/lib/utils";
import type { PropertySummary } from "../types/property";

export function PropertyCard({ p }: { p: PropertySummary }) {
  const location = [p.area, p.emirate].filter(Boolean).join(", ");
  const typeLabel = PROPERTY_TYPE_LABELS[p.propertyType as keyof typeof PROPERTY_TYPE_LABELS] ?? p.propertyType;

  return (
    <Link
      href={`/properties/${p.id}`}
      className="block rounded-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      <Card className="flex h-full flex-col gap-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold text-ink">{p.name}</h2>
            <p className="mt-1 truncate text-ink-soft">{location}</p>
          </div>
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-shell text-ink">
            <Building2 className="size-5" />
          </span>
        </div>

        <div>
          <div className="flex items-end justify-between">
            <span className="text-4xl font-semibold tracking-tight text-ink">{p.occupancy}%</span>
            <span className="text-sm text-ink-soft">{p.rented} of {p.total} units rented</span>
          </div>
          <div className="mt-3 h-2.5 rounded-pill bg-shell" role="img" aria-label={`${p.occupancy}% occupied`}>
            <div className="h-full rounded-pill bg-ink" style={{ width: `${p.occupancy}%` }} />
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4 text-sm">
          <div className="min-w-0">
            <p className="text-ink-soft">Owner</p>
            <p className="truncate font-medium text-ink">{p.ownerName ?? "Not assigned"}</p>
          </div>
          <div className="text-right">
            <p className="text-ink-soft">Yearly rent</p>
            <p className="font-medium text-ink">{formatAED(p.rentRoll)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="blue">{typeLabel}</Badge>
          {p.vacant > 0 && <Badge variant="green">{p.vacant} vacant</Badge>}
          {p.maintenance > 0 && <Badge variant="pink">{p.maintenance} in maintenance</Badge>}
        </div>
      </Card>
    </Link>
  );
}
