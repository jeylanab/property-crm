import { createClient } from "@/lib/supabase/server";
import type { PropertySummary } from "../types/property";
import { summarizeUnits } from "./summarize-units";

type Raw = {
  id: string; name: string; emirate: string; area: string | null; property_type: string;
  owner: { full_name: string } | null;
  units: { status: string; annual_rent: number | null }[];
};

export async function getProperties(search?: string): Promise<PropertySummary[]> {
  const supabase = await createClient();

  let query = supabase
    .from("properties")
    .select("id, name, emirate, area, property_type, owner:owners(full_name), units(status, annual_rent)")
    .order("name");

  // strip characters that would break the filter syntax
  const term = (search ?? "").replace(/[,()%*\\]/g, " ").trim();
  if (term) query = query.or(`name.ilike.%${term}%,area.ilike.%${term}%`);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return ((data ?? []) as unknown as Raw[]).map((p) => ({
    id: p.id,
    name: p.name,
    emirate: p.emirate,
    area: p.area,
    propertyType: p.property_type,
    ownerName: p.owner?.full_name ?? null,
    ...summarizeUnits(p.units ?? []),
  }));
}
