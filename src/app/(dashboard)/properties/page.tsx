import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { getProperties } from "@/features/properties/queries/get-properties";
import { PropertyCard } from "@/features/properties/components/property-card";
import { SearchForm } from "@/features/properties/components/search-form";

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const properties = await getProperties(q);

  return (
    <>
      <PageHeader title="Properties">
        <SearchForm defaultValue={q} />
        <Link href="/properties/new" className={buttonVariants({ variant: "solid" })}>
          <Plus className="size-4" /> Add Property
        </Link>
      </PageHeader>

      {properties.length === 0 ? (
        <Card className="grid place-items-center gap-4 py-20 text-center">
          <p className="text-ink-soft">
            {q ? `No properties match "${q}".` : "No properties yet. Add your first building to get started."}
          </p>
          {!q && (
            <Link href="/properties/new" className={buttonVariants({ variant: "solid" })}>Add Property</Link>
          )}
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {properties.map((p) => <PropertyCard key={p.id} p={p} />)}
        </div>
      )}
    </>
  );
}
