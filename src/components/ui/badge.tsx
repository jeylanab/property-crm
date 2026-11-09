import { cn } from "@/lib/utils";

const variants = {
  lime:  "bg-lime text-lime-dark",                         // +10%
  coral: "bg-coral text-white",                            // -12%
  blue:  "bg-status-blueBg text-status-blueText",          // in progress
  green: "bg-status-greenBg text-status-greenText",        // complete / paid
  pink:  "bg-status-pinkBg text-status-pinkText",          // waiting / overdue
} as const;

export function Badge({
  variant = "blue", className, ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof variants }) {
  return (
    <span
      className={cn("inline-flex items-center rounded-pill px-3 py-1 text-xs font-semibold", variants[variant], className)}
      {...props}
    />
  );
}
