"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Field } from "@/components/ui/field";
import { DUBAI_AREAS, EMIRATES, PROPERTY_TYPES, PROPERTY_TYPE_LABELS } from "@/lib/constants";
import { createProperty, type CreatePropertyState } from "../actions/create-property";

export function PropertyForm({ owners }: { owners: { id: string; full_name: string }[] }) {
  const [state, formAction, pending] = useActionState<CreatePropertyState, FormData>(createProperty, null);
  const errors = state?.fieldErrors ?? {};

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Building name" htmlFor="name" error={errors.name} className="md:col-span-2">
          <Input id="name" name="name" required placeholder="Marina Heights Tower" />
        </Field>

        <Field label="Emirate" htmlFor="emirate" error={errors.emirate}>
          <Select id="emirate" name="emirate" defaultValue="Dubai">
            {EMIRATES.map((e) => <option key={e} value={e}>{e}</option>)}
          </Select>
        </Field>

        <Field label="Area" htmlFor="area" hint="Pick a suggestion or type your own.">
          <Input id="area" name="area" list="area-options" placeholder="Dubai Marina" autoComplete="off" />
          <datalist id="area-options">
            {DUBAI_AREAS.map((a) => <option key={a} value={a} />)}
          </datalist>
        </Field>

        <Field label="Property type" htmlFor="propertyType" error={errors.propertyType}>
          <Select id="propertyType" name="propertyType" defaultValue="apartment">
            {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{PROPERTY_TYPE_LABELS[t]}</option>)}
          </Select>
        </Field>

        <Field
          label="Owner" htmlFor="ownerId"
          hint={owners.length ? undefined : "No owners yet. You can assign one later."}
        >
          <Select id="ownerId" name="ownerId" defaultValue="">
            <option value="">No owner yet</option>
            {owners.map((o) => <option key={o.id} value={o.id}>{o.full_name}</option>)}
          </Select>
        </Field>

        <Field label="Address" htmlFor="address" className="md:col-span-2">
          <Input id="address" name="address" placeholder="Marina Walk, Dubai Marina" />
        </Field>
      </div>

      {state?.error && <p role="alert" className="text-sm text-status-pinkText">{state.error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" variant="solid" disabled={pending}>
          {pending ? "Saving..." : "Save property"}
        </Button>
        <Link href="/properties" className={buttonVariants({ variant: "outline" })}>Cancel</Link>
      </div>
    </form>
  );
}
