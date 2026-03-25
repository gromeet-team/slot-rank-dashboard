'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface SlotEntry {
  keyword: string;
  rank: number;
}

interface RankEntry {
  date: string;
  product: string;
  category_rank: number;
  slots: SlotEntry[];
}

const COLORS = ['#60a5fa', '#f472b6', '#34d399', '#fbbf24', '#a78bfa', '#fb923c'];

export default function RankChart({ data }: { data: RankEntry[] }) {
  // Extract all keywords
  const keywords = Array.from(
    new Set(data.flatMap((d) => d.slots.map((s) => s.keyword)))
  );

  // Build chart data: one entry per date with keyword ranks
  const chartData = data.map((entry) => {
    const point: Record<string, string | number> = { date: entry.date };
    entry.slots.forEach((s) => {
      point[s.keyword] = s.rank;
    });
    return point;
  });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis dataKey="date" stroke="#888" fontSize={12} />
        <YAxis reversed stroke="#888" fontSize={12} label={{ value: '순위', angle: -90, position: 'insideLeft', fill: '#888' }} />
        <Tooltip
          contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: 8 }}
          labelStyle={{ color: '#ccc' }}
        />
        <Legend />
        {keywords.map((kw, i) => (
          <Line
            key={kw}
            type="monotone"
            dataKey={kw}
            stroke={COLORS[i % COLORS.length]}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
