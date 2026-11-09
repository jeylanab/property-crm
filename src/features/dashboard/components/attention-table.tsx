import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatAED, formatDate } from "@/lib/utils";
import type { AttentionRow } from "../queries/build-dashboard";

export function AttentionTable({ rows }: { rows: AttentionRow[] }) {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-4 p-6 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-ink">Cheques Needing Attention</h2>
          <p className="mt-1 text-ink-soft">Overdue and bounced cheques to follow up on.</p>
        </div>
        <Link href="/payments" className="flex items-center gap-2 rounded-pill border border-line px-4 py-2 text-sm text-ink hover:bg-shell">
          View All <ArrowRight className="size-4" />
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="px-6 pb-8 pt-4 text-ink-soft">All cheques are on track. Nothing to follow up.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-shell/60 text-ink-soft">
              <tr>
                <th className="px-6 py-3 font-medium">Cheque No</th>
                <th className="px-3 py-3 font-medium">Tenant</th>
                <th className="px-3 py-3 font-medium">Due date</th>
                <th className="px-3 py-3 font-medium">Bank</th>
                <th className="px-3 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-line">
                  <td className="px-6 py-4 font-medium text-ink">{r.chequeNumber}</td>
                  <td className="px-3 py-4">
                    <p className="font-medium text-ink">{r.tenantName}</p>
                    <p className="text-xs text-ink-soft">{r.unitLabel}</p>
                  </td>
                  <td className="px-3 py-4 text-ink">{formatDate(r.dueDate)}</td>
                  <td className="px-3 py-4 text-ink">{r.bank}</td>
                  <td className="px-3 py-4 font-medium text-ink">{formatAED(r.amount)}</td>
                  <td className="px-6 py-4"><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
