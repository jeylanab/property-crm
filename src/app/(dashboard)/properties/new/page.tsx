import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { getOwners } from "@/features/owners/queries/get-owners";
import { PropertyForm } from "@/features/properties/components/property-form";

export default async function NewPropertyPage() {
  const owners = await getOwners();

  return (
    <>
      <Link href="/properties" className="mb-4 inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink">
        <ArrowLeft className="size-4" /> Back to properties
      </Link>
      <PageHeader title="Add Property" />
      <PropertyForm owners={owners} />
    </>
  );
}
