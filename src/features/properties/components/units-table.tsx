import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatAED } from "@/lib/utils";
import type { UnitDetail } from "../types/property";

export function UnitsTable({ units }: { units: UnitDetail[] }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="p-6 pb-4">
        <h2 className="text-xl font-semibold text-ink">Units</h2>
        <p className="mt-1 text-ink-soft">Every unit in this building and who lives there.</p>
      </div>

      {units.length === 0 ? (
        <p className="px-6 pb-8 pt-2 text-ink-soft">No units yet. Adding units comes in the next step.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-shell/60 text-ink-soft">
              <tr>
                <th className="px-6 py-3 font-medium">Unit</th>
                <th className="px-3 py-3 font-medium">Bedrooms</th>
                <th className="px-3 py-3 font-medium">Size</th>
                <th className="px-3 py-3 font-medium">Yearly rent</th>
                <th className="px-3 py-3 font-medium">Tenant</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {units.map((u) => (
                <tr key={u.id} className="border-t border-line">
                  <td className="px-6 py-4 font-medium text-ink">{u.unitNumber}</td>
                  <td className="px-3 py-4 text-ink">{u.bedrooms === null ? "-" : u.bedrooms === 0 ? "Studio" : `${u.bedrooms} BR`}</td>
                  <td className="px-3 py-4 text-ink">{u.sizeSqft === null ? "-" : `${Math.round(u.sizeSqft)} sqft`}</td>
                  <td className="px-3 py-4 font-medium text-ink">{u.annualRent === null ? "-" : formatAED(u.annualRent)}</td>
                  <td className="px-3 py-4 text-ink">{u.tenantName ?? "-"}</td>
                  <td className="px-6 py-4"><StatusBadge status={u.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
