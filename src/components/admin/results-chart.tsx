"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type Entry = {
  id: string;
  display_name: string;
  votes: number;
};

type Props = {
  candidates: Entry[];
  totalVotes: number;
};

const SHADES = [
  "hsl(0 0% 10%)",
  "hsl(0 0% 35%)",
  "hsl(0 0% 58%)",
  "hsl(0 0% 76%)",
  "hsl(0 0% 88%)",
];

export function ResultsChart({ candidates, totalVotes }: Props) {
  if (totalVotes === 0) {
    return (
      <div className="flex h-36 items-center justify-center text-xs text-muted-foreground">
        Aucun bulletin à afficher
      </div>
    );
  }

  const data = candidates
    .filter((c) => c.votes > 0)
    .map((c) => ({
      name: c.display_name,
      value: c.votes,
      pct: Math.round((c.votes / totalVotes) * 100),
    }));

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={46}
            outerRadius={72}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={SHADES[i % SHADES.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [
              `${value} voix`,
              name,
            ]}
            contentStyle={{
              borderRadius: "10px",
              border: "1px solid hsl(0 0% 90%)",
              fontSize: "12px",
              padding: "6px 10px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Légende */}
      <div className="space-y-1.5">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-2 text-xs">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ background: SHADES[i % SHADES.length] }}
            />
            <span className="min-w-0 flex-1 truncate text-muted-foreground">{d.name}</span>
            <span className="tabular-nums font-semibold text-foreground">{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
