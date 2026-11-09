import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Plain GET form: submits to /properties?q=... so the server does the filtering.
export function SearchForm({ defaultValue }: { defaultValue?: string }) {
  return (
    <form action="/properties" method="get" role="search" className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-ink-faint" />
      <Input
        name="q" defaultValue={defaultValue} aria-label="Search properties"
        placeholder="Search by name or area" className="w-full pl-11 sm:w-[280px]"
      />
    </form>
  );
}
