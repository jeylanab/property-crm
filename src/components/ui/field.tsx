import { cn } from "@/lib/utils";

export function Field({
  label, htmlFor, error, hint, className, children,
}: {
  label: string; htmlFor: string; error?: string; hint?: string;
  className?: string; children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">{label}</label>
      {children}
      {hint && !error && <p className="text-xs text-ink-soft">{hint}</p>}
      {error && <p role="alert" className="text-xs text-status-pinkText">{error}</p>}
    </div>
  );
}
