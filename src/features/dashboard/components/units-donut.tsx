"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";

type Props = { rented: number; vacant: number; maintenance: number; total: number };

export function UnitsDonut({ rented, vacant, maintenance, total }: Props) {
  const slices = [
    { name: "Rented", value: rented, color: "#0B0A1F" },
    { name: "Vacant", value: vacant, color: "#D9D9DE" },
    { name: "Maintenance", value: maintenance, color: "#A3A3AD" },
  ];
  // an empty donut still needs one slice to draw
  const data = total ? slices : [{ name: "None", value: 1, color: "#E6E6E9" }];

  return (
    <Card className="flex flex-col">
      <p className="text-lg font-semibold text-ink">Units by Status</p>

      <div className="relative mt-4 h-[230px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data} dataKey="value" innerRadius={72} outerRadius={102}
              paddingAngle={total ? 3 : 0} cornerRadius={12}
              startAngle={90} endAngle={-270} stroke="none"
            >
              {data.map((s) => <Cell key={s.name} fill={s.color} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-4xl font-semibold text-ink">{total}</p>
            <p className="text-sm text-ink-soft">Total units</p>
          </div>
        </div>
      </div>

      <ul className="mt-4 space-y-3">
        {slices.map((s) => (
          <li key={s.name} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-ink-soft">
              <i className="size-3 rounded-full" style={{ background: s.color }} /> {s.name}
            </span>
            <span className="font-semibold text-ink">{s.value}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
