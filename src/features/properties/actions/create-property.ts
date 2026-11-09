"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { EMIRATES, PROPERTY_TYPES } from "@/lib/constants";

export type CreatePropertyState = {
  error?: string;
  fieldErrors?: Partial<Record<"name" | "emirate" | "propertyType", string>>;
} | null;

const text = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

export async function createProperty(_prev: CreatePropertyState, formData: FormData): Promise<CreatePropertyState> {
  const name = text(formData, "name");
  const emirate = text(formData, "emirate");
  const propertyType = text(formData, "propertyType");
  const area = text(formData, "area");
  const address = text(formData, "address");
  const ownerId = text(formData, "ownerId");

  const fieldErrors: NonNullable<CreatePropertyState>["fieldErrors"] = {};
  if (name.length < 2) fieldErrors.name = "Enter the building name.";
  if (!(EMIRATES as readonly string[]).includes(emirate)) fieldErrors.emirate = "Pick an emirate.";
  if (!(PROPERTY_TYPES as readonly string[]).includes(propertyType)) fieldErrors.propertyType = "Pick a property type.";
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const supabase = await createClient();
  const { error } = await supabase.from("properties").insert({
    name,
    emirate,
    property_type: propertyType,
    area: area || null,
    address: address || null,
    owner_id: ownerId || null,
  });

  if (error) return { error: `Could not save the property. ${error.message}` };

  revalidatePath("/properties");
  redirect("/properties");
}
