'use client';

import { useEffect, useState } from 'react';

/**
 * ActivityChart — Line chart showing daily scan trend using Recharts.
 * Marked 'use client' because Recharts requires DOM/browser APIs.
 * Data is passed down as a prop from the Server Component parent.
 */
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

/** Format YYYY-MM-DD into a short Spanish label like "19 ago" */
function formatAxisDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00'); // avoid timezone offset issues
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
}

/** Custom tooltip shown on hover */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--surface-2)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '8px',
      padding: '0.625rem 0.875rem',
      fontSize: '0.875rem',
    }}>
      <p style={{ color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{formatAxisDate(label)}</p>
      <p style={{ fontWeight: 700, color: 'var(--brand-light)' }}>
        {payload[0].value} {payload[0].value === 1 ? 'escaneo' : 'escaneos'}
      </p>
    </div>
  );
}

export default function ActivityChart({ data }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateView = () => setIsMobile(window.innerWidth < 768);
    updateView();
    window.addEventListener('resize', updateView);
    return () => window.removeEventListener('resize', updateView);
  }, []);

  // Show every ~5th label to avoid clutter on a 30-day axis
  const tickIndices = new Set([0, 6, 12, 18, 24, 29]);

  return (
    <ResponsiveContainer width="100%" height={isMobile ? 180 : 220}>
      <AreaChart data={data} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="scanGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#7c3aed" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.02} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(167, 139, 250, 0.08)"
          vertical={false}
        />

        <XAxis
          dataKey="date"
          tick={{ fill: '#7c6fa0', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(val, idx) => {
            if (isMobile) {
              return idx % 5 === 0 ? formatAxisDate(val) : '';
            }
            return tickIndices.has(idx) ? formatAxisDate(val) : '';
          }}
          interval={isMobile ? 4 : 0}
        />

        <YAxis
          tick={{ fill: '#7c6fa0', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />

        <Tooltip content={<CustomTooltip />} />

        <Area
          type="monotone"
          dataKey="count"
          stroke="#7c3aed"
          strokeWidth={2.5}
          fill="url(#scanGradient)"
          dot={false}
          activeDot={{ r: 5, fill: '#a78bfa', stroke: 'var(--surface-0)', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
