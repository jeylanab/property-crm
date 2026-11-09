import { Building2, Banknote } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { getDashboardData } from "@/features/dashboard/queries/get-dashboard-data";
import { RevenueChart } from "@/features/dashboard/components/revenue-chart";
import { UnitsDonut } from "@/features/dashboard/components/units-donut";
import { AttentionTable } from "@/features/dashboard/components/attention-table";
import { ExpiringLeases } from "@/features/dashboard/components/expiring-leases";
import { formatAED } from "@/lib/utils";

export default async function DashboardPage() {
  const { occupancy, overdue, revenue, attention, expiring } = await getDashboardData();

  return (
    <>
      <PageHeader title="Dashboard" />

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-[1fr_1.5fr_1.1fr]">
        <div className="grid gap-6">
          <StatCard
            label="Occupancy Rate"
            value={`${occupancy.rate}%`}
            badge={`${occupancy.rented} of ${occupancy.total} units`}
            icon={<Building2 className="size-6" />}
            href="/properties" linkLabel="View Properties"
          />
          <StatCard
            label="Overdue and Bounced"
            value={String(overdue.count)}
            badge={formatAED(overdue.amount)}
            tone={overdue.count ? "bad" : "good"}
            icon={<Banknote className="size-6" />}
            href="/payments" linkLabel="View Payments"
          />
        </div>

        <RevenueChart months={revenue.months} collected={revenue.collected} rate={revenue.rate} />
        <UnitsDonut {...occupancy} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
        <AttentionTable rows={attention} />
        <ExpiringLeases rows={expiring} />
      </div>
    </>
  );
}
