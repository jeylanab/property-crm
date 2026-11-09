// Pure functions: turn raw rows into the numbers the dashboard shows.
// Kept separate from Supabase so it is easy to test and reuse.

export type PaymentStatus = "pending" | "paid" | "overdue" | "bounced";
export type UnitStatus = "vacant" | "rented" | "maintenance";

type UnitInfo = { unit_number: string; property: { name: string } | null } | null;

export type UnitRow = { status: UnitStatus };

export type PaymentRow = {
  id: string;
  amount: number;
  due_date: string;
  paid_date: string | null;
  status: PaymentStatus;
  cheque_number: string | null;
  bank_name: string | null;
  method: string;
  lease: { tenant: { full_name: string } | null; unit: UnitInfo } | null;
};

export type LeaseRow = {
  id: string;
  end_date: string;
  tenant: { full_name: string } | null;
  unit: UnitInfo;
};

export type AttentionRow = {
  id: string;
  chequeNumber: string;
  tenantName: string;
  unitLabel: string;
  dueDate: string;
  bank: string;
  amount: number;
  status: PaymentStatus;
};

export type ExpiringRow = {
  id: string;
  tenantName: string;
  unitLabel: string;
  endDate: string;
  daysLeft: number;
};

export type DashboardData = {
  occupancy: { rate: number; rented: number; vacant: number; maintenance: number; total: number };
  overdue: { count: number; amount: number };
  revenue: {
    months: { month: string; collected: number; outstanding: number }[];
    collected: number;
    rate: number;
  };
  attention: AttentionRow[];
  expiring: ExpiringRow[];
};

const pad = (n: number) => String(n).padStart(2, "0");
export const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function unitLabel(unit: UnitInfo) {
  if (!unit) return "";
  return unit.property?.name ? `Unit ${unit.unit_number}, ${unit.property.name}` : `Unit ${unit.unit_number}`;
}

export function buildDashboard(
  units: UnitRow[],
  payments: PaymentRow[],
  leases: LeaseRow[],
  today = new Date()
): DashboardData {
  const todayISO = toISO(today);

  // ----- occupancy -----
  const count = (s: UnitStatus) => units.filter((u) => u.status === s).length;
  const rented = count("rented");
  const total = units.length;
  const occupancy = {
    rate: total ? Math.round((rented / total) * 100) : 0,
    rented,
    vacant: count("vacant"),
    maintenance: count("maintenance"),
    total,
  };

  // ----- overdue + bounced -----
  const problem = payments.filter((p) => p.status === "overdue" || p.status === "bounced");
  const overdue = {
    count: problem.length,
    amount: problem.reduce((sum, p) => sum + Number(p.amount), 0),
  };

  // ----- last 6 months: collected vs outstanding -----
  const months = Array.from({ length: 6 }, (_, idx) => {
    const d = new Date(today.getFullYear(), today.getMonth() - (5 - idx), 1);
    return {
      key: `${d.getFullYear()}-${pad(d.getMonth() + 1)}`,
      month: d.toLocaleString("en-US", { month: "short" }),
      collected: 0,
      outstanding: 0,
    };
  });
  const byKey = new Map(months.map((m) => [m.key, m]));
  let dueToDate = 0;

  for (const p of payments) {
    const m = byKey.get(p.due_date.slice(0, 7));
    if (!m) continue;
    const amount = Number(p.amount);
    if (p.status === "paid") m.collected += amount;
    else m.outstanding += amount;
    if (p.due_date <= todayISO) dueToDate += amount;
  }
  const collected = months.reduce((sum, m) => sum + m.collected, 0);

  // ----- cheques needing attention (oldest first) -----
  const attention: AttentionRow[] = [...problem]
    .sort((a, b) => a.due_date.localeCompare(b.due_date))
    .slice(0, 4)
    .map((p) => ({
      id: p.id,
      chequeNumber: p.cheque_number ?? "Bank transfer",
      tenantName: p.lease?.tenant?.full_name ?? "Unknown tenant",
      unitLabel: unitLabel(p.lease?.unit ?? null),
      dueDate: p.due_date,
      bank: p.bank_name ?? "-",
      amount: Number(p.amount),
      status: p.status,
    }));

  // ----- leases expiring soon -----
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const expiring: ExpiringRow[] = leases.map((l) => ({
    id: l.id,
    tenantName: l.tenant?.full_name ?? "Unknown tenant",
    unitLabel: unitLabel(l.unit),
    endDate: l.end_date,
    daysLeft: Math.round((new Date(`${l.end_date}T00:00:00`).getTime() - startOfToday) / 86400000),
  }));

  return {
    occupancy,
    overdue,
    revenue: {
      months: months.map(({ month, collected, outstanding }) => ({ month, collected, outstanding })),
      collected,
      rate: dueToDate ? Math.round((collected / dueToDate) * 100) : 0,
    },
    attention,
    expiring,
  };
}
