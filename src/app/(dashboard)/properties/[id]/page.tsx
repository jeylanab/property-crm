import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PROPERTY_TYPE_LABELS } from "@/lib/constants";
import { formatAED } from "@/lib/utils";
import { getProperty } from "@/features/properties/queries/get-property";
import { UnitsTable } from "@/features/properties/components/units-table";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <p className="text-ink-soft">{label}</p>
      <p className="mt-3 text-4xl font-semibold tracking-tight text-ink">{value}</p>
    </Card>
  );
}

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getProperty(id);
  if (!result) notFound();

  const { property, units, summary } = result;
  const location = [property.area, property.emirate].filter(Boolean).join(", ");
  const typeLabel = PROPERTY_TYPE_LABELS[property.propertyType as keyof typeof PROPERTY_TYPE_LABELS] ?? property.propertyType;

  return (
    <>
      <Link href="/properties" className="mb-4 inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink">
        <ArrowLeft className="size-4" /> Back to properties
      </Link>

      <PageHeader title={property.name} />
      <div className="-mt-5 mb-8 flex flex-wrap items-center gap-3 text-ink-soft">
        <span>{location}</span>
        <Badge variant="blue">{typeLabel}</Badge>
        <span>Owner: {property.ownerName ?? "Not assigned"}</span>
      </div>
      {property.address && <p className="-mt-4 mb-8 text-ink-soft">{property.address}</p>}

      <div className="mb-6 grid gap-6 sm:grid-cols-3">
        <Stat label="Occupancy" value={`${summary.occupancy}%`} />
        <Stat label="Units rented" value={`${summary.rented} of ${summary.total}`} />
        <Stat label="Yearly rent" value={formatAED(summary.rentRoll)} />
      </div>

      <UnitsTable units={units} />
    </>
  );
}
