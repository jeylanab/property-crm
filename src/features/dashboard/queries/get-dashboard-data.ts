import { createClient } from "@/lib/supabase/server";
import {
  buildDashboard, toISO,
  type DashboardData, type LeaseRow, type PaymentRow, type UnitRow,
} from "./build-dashboard";

const UNIT_SHAPE = "unit_number, property:properties(name)";

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();

  const today = new Date();
  const in90 = new Date(today);
  in90.setDate(in90.getDate() + 90);

  const [unitsRes, paymentsRes, leasesRes] = await Promise.all([
    supabase.from("units").select("status"),
    supabase
      .from("payments")
      .select(`id, amount, due_date, paid_date, status, cheque_number, bank_name, method,
               lease:leases(tenant:tenants(full_name), unit:units(${UNIT_SHAPE}))`),
    supabase
      .from("leases")
      .select(`id, end_date, tenant:tenants(full_name), unit:units(${UNIT_SHAPE})`)
      .eq("status", "active")
      .gte("end_date", toISO(today))
      .lte("end_date", toISO(in90))
      .order("end_date")
      .limit(5),
  ]);

  const error = unitsRes.error ?? paymentsRes.error ?? leasesRes.error;
  if (error) throw new Error(error.message);

  return buildDashboard(
    (unitsRes.data ?? []) as unknown as UnitRow[],
    (paymentsRes.data ?? []) as unknown as PaymentRow[],
    (leasesRes.data ?? []) as unknown as LeaseRow[],
    today
  );
}
