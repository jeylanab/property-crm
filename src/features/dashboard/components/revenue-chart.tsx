"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatAED } from "@/lib/utils";

type Props = {
  months: { month: string; collected: number; outstanding: number }[];
  collected: number;
  rate: number;
};

export function RevenueChart({ months, collected, rate }: Props) {
  return (
    <Card className="flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-ink">Rent Collected</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="text-4xl font-semibold tracking-tight text-ink">{formatAED(collected)}</span>
            <Badge variant="lime">{rate}% collected</Badge>
          </div>
          <p className="mt-1 text-sm text-ink-soft">Last 6 months</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-5 text-sm text-ink-soft">
        <span className="flex items-center gap-2"><i className="size-3 rounded-full bg-ink" /> Collected</span>
        <span className="flex items-center gap-2"><i className="size-3 rounded-full bg-[#D2D2D8]" /> Outstanding</span>
      </div>

      <div className="mt-2 h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={months} margin={{ top: 8, right: 4, left: 0, bottom: 0 }} barCategoryGap="22%">
            <defs>
              <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                <rect width="8" height="8" fill="#EDEDEF" />
                <line x1="0" y1="0" x2="0" y2="8" stroke="#D2D2D8" strokeWidth="3" />
              </pattern>
            </defs>
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#6B6B76", fontSize: 13 }} />
            <YAxis
              width={44} tickLine={false} axisLine={false}
              tick={{ fill: "#A3A3AD", fontSize: 12 }}
              tickFormatter={(v: number) => (v >= 1000 ? `${Math.round(v / 1000)}k` : String(v))}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              formatter={(value, name) => [formatAED(Number(value)), name === "collected" ? "Collected" : "Outstanding"]}
              contentStyle={{ borderRadius: 16, border: "1px solid #E6E6E9", boxShadow: "none" }}
            />
            <Bar dataKey="collected" stackId="rent" fill="#0B0A1F" radius={[0, 0, 14, 14]} />
            <Bar dataKey="outstanding" stackId="rent" fill="url(#hatch)" radius={[14, 14, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
