import { createClient } from "@/lib/supabase/server";

export async function getOwners() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("owners").select("id, full_name").order("full_name");
  if (error) throw new Error(error.message);
  return (data ?? []) as { id: string; full_name: string }[];
}
