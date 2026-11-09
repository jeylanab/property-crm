import { cn } from "@/lib/utils";

const variants = {
  solid:   "bg-ink text-white hover:bg-ink/90",
  outline: "border border-ink text-ink bg-transparent hover:bg-ink/5",
  ghost:   "text-ink hover:bg-ink/5",
} as const;

type Variant = keyof typeof variants;

// Use on <Link> too: <Link className={buttonVariants({ variant: "solid" })}>
export function buttonVariants({ variant = "outline", className }: { variant?: Variant; className?: string } = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-pill px-5 py-2.5 text-sm font-medium transition-colors",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
    "disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant], className
  );
}

export function Button({
  variant = "outline", className, ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={buttonVariants({ variant, className })} {...props} />;
}
