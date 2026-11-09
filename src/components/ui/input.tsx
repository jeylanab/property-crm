import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-pill border border-line bg-card px-5 py-3 text-ink placeholder:text-ink-faint",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink",
        className
      )}
      {...props}
    />
  );
}
