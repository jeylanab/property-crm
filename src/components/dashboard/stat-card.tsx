import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = {
  label: string;
  value: string;
  badge: string;
  tone?: "good" | "bad";
  icon: React.ReactNode;
  href: string;
  linkLabel: string;
};

export function StatCard({ label, value, badge, tone = "good", icon, href, linkLabel }: Props) {
  return (
    <Card className="flex flex-col justify-between gap-8">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-ink">{label}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-5xl font-semibold tracking-tight text-ink">{value}</span>
            <Badge variant={tone === "good" ? "lime" : "coral"}>{badge}</Badge>
          </div>
        </div>
        <span className="size-14 shrink-0 rounded-full bg-shell grid place-items-center text-ink">{icon}</span>
      </div>
      <Link href={href} className="flex items-center justify-between border-t border-line pt-4 text-ink underline underline-offset-4">
        {linkLabel} <ArrowRight className="size-5" />
      </Link>
    </Card>
  );
}
