import { PageHeader } from "./page-header";
import { Card } from "@/components/ui/card";

// Temporary page body. Replace with the real module as we build each step.
export function ModulePlaceholder({ title }: { title: string }) {
  return (
    <>
      <PageHeader title={title} />
      <Card className="grid place-items-center py-24 text-ink-soft">
        {title} module coming in a later step.
      </Card>
    </>
  );
}
