import { Badge } from "./badge";

const MAP = {
  paid:        { label: "Paid",        variant: "green" },
  pending:     { label: "Pending",     variant: "blue" },
  overdue:     { label: "Overdue",     variant: "pink" },
  bounced:     { label: "Bounced",     variant: "coral" },
  rented:      { label: "Rented",      variant: "green" },
  vacant:      { label: "Vacant",      variant: "blue" },
  maintenance: { label: "Maintenance", variant: "pink" },
} as const;

export function StatusBadge({ status }: { status: keyof typeof MAP }) {
  const { label, variant } = MAP[status];
  return <Badge variant={variant}>{label}</Badge>;
}
