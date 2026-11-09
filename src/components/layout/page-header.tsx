export function PageHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
      <h1 className="text-3xl font-semibold text-ink">{title}</h1>
      <div className="flex items-center gap-3">{children}</div>
    </div>
  );
}
