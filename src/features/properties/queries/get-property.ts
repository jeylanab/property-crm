import { createClient } from "@/lib/supabase/server";
import type { PropertyDetail, UnitDetail } from "../types/property";
import { summarizeUnits } from "./summarize-units";

type RawProperty = {
  id: string; name: string; emirate: string; area: string | null; address: string | null;
  property_type: string; owner: { full_name: string } | null;
};
type RawUnit = {
  id: string; unit_number: string; bedrooms: number | null; size_sqft: number | null;
  annual_rent: number | null; status: UnitDetail["status"];
  leases: { status: string; tenant: { full_name: string } | null }[];
};

export async function getProperty(id: string) {
  const supabase = await createClient();

  const [propRes, unitsRes] = await Promise.all([
    supabase
      .from("properties")
      .select("id, name, emirate, area, address, property_type, owner:owners(full_name)")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("units")
      .select("id, unit_number, bedrooms, size_sqft, annual_rent, status, leases(status, tenant:tenants(full_name))")
      .eq("property_id", id)
      .order("unit_number"),
  ]);

  // a bad id or a row from another account both end up here
  if (propRes.error || !propRes.data) return null;
  if (unitsRes.error) throw new Error(unitsRes.error.message);

  const p = propRes.data as unknown as RawProperty;
  const rawUnits = (unitsRes.data ?? []) as unknown as RawUnit[];

  const property: PropertyDetail = {
    id: p.id, name: p.name, emirate: p.emirate, area: p.area, address: p.address,
    propertyType: p.property_type, ownerName: p.owner?.full_name ?? null,
  };

  const units: UnitDetail[] = rawUnits.map((u) => ({
    id: u.id,
    unitNumber: u.unit_number,
    bedrooms: u.bedrooms,
    sizeSqft: u.size_sqft === null ? null : Number(u.size_sqft),
    annualRent: u.annual_rent === null ? null : Number(u.annual_rent),
    status: u.status,
    tenantName: u.leases?.find((l) => l.status === "active")?.tenant?.full_name ?? null,
  }));

  const summary = summarizeUnits(rawUnits.map((u) => ({ status: u.status, annual_rent: u.annual_rent })));
  return { property, units, summary };
}
