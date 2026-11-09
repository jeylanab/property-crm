import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { ExpiringRow } from "../queries/build-dashboard";

export function ExpiringLeases({ rows }: { rows: ExpiringRow[] }) {
  return (
    <Card>
      <h2 className="text-xl font-semibold text-ink">Leases Expiring Soon</h2>
      <p className="mt-1 text-ink-soft">Next 90 days. Send renewal notices early.</p>

      {rows.length === 0 ? (
        <p className="mt-6 text-ink-soft">No leases expiring in the next 90 days.</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {rows.map((l) => (
            <li key={l.id} className="flex items-center justify-between gap-3 rounded-[20px] bg-shell p-4">
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink">{l.tenantName}</p>
                <p className="truncate text-xs text-ink-soft">{l.unitLabel}</p>
              </div>
              <div className="shrink-0 text-right">
                <Badge variant={l.daysLeft <= 30 ? "pink" : "blue"}>
                  {l.daysLeft === 0 ? "Today" : `${l.daysLeft} days`}
                </Badge>
                <p className="mt-1 text-xs text-ink-soft">{formatDate(l.endDate)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
